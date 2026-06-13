import { existsSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function parseAdminArgs(args) {
  if (args[0] === 'list' && args.length === 1) {
    return { command: 'list' };
  }

  if (args[0] === 'delete' && args.length === 2) {
    const id = Number(args[1]);
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new Error('삭제할 방명록의 숫자 ID를 입력해 주세요.');
    }
    return { command: 'delete', id };
  }

  throw new Error('사용법: node scripts/guestbook-admin.mjs list | delete <id>');
}

export function loadEnv(filePath = '.env') {
  if (!existsSync(filePath)) return {};

  return Object.fromEntries(
    readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#') && line.includes('='))
      .map(line => {
        const separator = line.indexOf('=');
        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
        return [key, value];
      })
  );
}

export function createAdminClient(options) {
  const baseUrl = String(options.supabaseUrl || '').replace(/\/+$/, '');
  const key = options.serviceRoleKey;
  const fetchImpl = options.fetchImpl || fetch;
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`
  };

  async function request(path, requestOptions = {}) {
    const response = await fetchImpl(`${baseUrl}/rest/v1/${path}`, {
      ...requestOptions,
      headers: {
        ...headers,
        ...requestOptions.headers
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Supabase 요청 실패 (${response.status})`);
    }

    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  return {
    list() {
      const query = new URLSearchParams({
        select: 'id,name,message,created_at',
        order: 'created_at.desc'
      });
      return request(`guestbook_entries?${query.toString()}`);
    },

    deleteById(id) {
      return request(`guestbook_entries?id=eq.${id}`, {
        method: 'DELETE',
        headers: { Prefer: 'return=minimal' }
      });
    }
  };
}

function requireAdminConfig(env) {
  const supabaseUrl = env.SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('.env에 SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 설정해 주세요.');
  }

  return { supabaseUrl, serviceRoleKey };
}

function printEntries(entries) {
  if (!entries.length) {
    console.log('등록된 방명록이 없습니다.');
    return;
  }

  for (const entry of entries) {
    const date = new Date(entry.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    console.log(`[${entry.id}] ${entry.name} | ${date}`);
    console.log(entry.message);
    console.log('');
  }
}

async function main() {
  const command = parseAdminArgs(process.argv.slice(2));
  const env = { ...loadEnv(), ...process.env };
  const client = createAdminClient(requireAdminConfig(env));

  if (command.command === 'list') {
    printEntries(await client.list());
    return;
  }

  await client.deleteById(command.id);
  console.log(`방명록 ID ${command.id}을(를) 삭제했습니다.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
