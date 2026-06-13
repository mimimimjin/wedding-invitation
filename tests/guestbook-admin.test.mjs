import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createAdminClient,
  parseAdminArgs
} from '../scripts/guestbook-admin.mjs';

test('admin arguments support list and numeric delete commands', () => {
  assert.deepEqual(parseAdminArgs(['list']), { command: 'list' });
  assert.deepEqual(parseAdminArgs(['delete', '42']), { command: 'delete', id: 42 });
  assert.throws(() => parseAdminArgs(['delete', 'abc']), /숫자 ID/);
  assert.throws(() => parseAdminArgs([]), /사용법/);
});

test('admin client lists entries with service role authorization', async () => {
  const calls = [];
  const client = createAdminClient({
    supabaseUrl: 'https://example.supabase.co/',
    serviceRoleKey: 'secret-key',
    fetchImpl: async (...args) => {
      calls.push(args);
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    }
  });

  await client.list();

  assert.match(calls[0][0], /guestbook_entries\?select=/);
  assert.equal(calls[0][1].headers.Authorization, 'Bearer secret-key');
});

test('admin client deletes an entry by id', async () => {
  const calls = [];
  const client = createAdminClient({
    supabaseUrl: 'https://example.supabase.co',
    serviceRoleKey: 'secret-key',
    fetchImpl: async (...args) => {
      calls.push(args);
      return new Response(null, { status: 204 });
    }
  });

  await client.deleteById(7);

  assert.equal(calls[0][1].method, 'DELETE');
  assert.match(calls[0][0], /guestbook_entries\?id=eq.7$/);
});
