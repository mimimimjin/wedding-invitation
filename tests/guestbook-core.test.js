const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createGuestbookClient,
  formatEntryDate,
  isGuestbookConfigured,
  validateEntry
} = require('../guestbook-core.js');

test('guestbook is configured only when enabled and both public values exist', () => {
  assert.equal(isGuestbookConfigured({
    enabled: true,
    supabaseUrl: 'https://example.supabase.co',
    supabaseAnonKey: 'public-key'
  }), true);
  assert.equal(isGuestbookConfigured({
    enabled: false,
    supabaseUrl: 'https://example.supabase.co',
    supabaseAnonKey: 'public-key'
  }), false);
  assert.equal(isGuestbookConfigured({ enabled: true }), false);
});

test('entry validation trims values and accepts valid input', () => {
  assert.deepEqual(validateEntry({
    name: '  하객  ',
    message: '  결혼 축하해요!  ',
    password: '1234'
  }), {
    valid: true,
    value: {
      name: '하객',
      message: '결혼 축하해요!',
      password: '1234'
    },
    errors: {}
  });
});

test('entry validation rejects invalid fields', () => {
  const result = validateEntry({
    name: '',
    message: 'a'.repeat(501),
    password: '12ab'
  });

  assert.equal(result.valid, false);
  assert.deepEqual(Object.keys(result.errors), ['name', 'message', 'password']);
});

test('formatEntryDate returns a compact Korean date', () => {
  assert.equal(formatEntryDate('2026-06-13T12:34:00+09:00'), '2026. 6. 13.');
});

test('client lists newest guestbook entries with public headers', async () => {
  const calls = [];
  const client = createGuestbookClient({
    supabaseUrl: 'https://example.supabase.co/',
    supabaseAnonKey: 'public-key',
    fetchImpl: async (...args) => {
      calls.push(args);
      return new Response(JSON.stringify([{ id: 2, name: '미진', message: '축하해요', created_at: '2026-06-13' }]), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    }
  });

  const entries = await client.list();

  assert.equal(entries.length, 1);
  assert.equal(calls[0][0], 'https://example.supabase.co/rest/v1/guestbook_entries?select=id%2Cname%2Cmessage%2Ccreated_at&order=created_at.desc');
  assert.equal(calls[0][1].headers.apikey, 'public-key');
});

test('client creates and deletes entries through RPC endpoints', async () => {
  const calls = [];
  const client = createGuestbookClient({
    supabaseUrl: 'https://example.supabase.co',
    supabaseAnonKey: 'public-key',
    fetchImpl: async (...args) => {
      calls.push(args);
      return new Response(null, { status: 204 });
    }
  });

  await client.create({ name: '하객', message: '축하합니다', password: '1234' });
  await client.deleteOwn(42, '1234');

  assert.equal(calls[0][0], 'https://example.supabase.co/rest/v1/rpc/create_guestbook_entry');
  assert.deepEqual(JSON.parse(calls[0][1].body), {
    entry_name: '하객',
    entry_message: '축하합니다',
    entry_password: '1234'
  });
  assert.equal(calls[1][0], 'https://example.supabase.co/rest/v1/rpc/delete_guestbook_entry');
  assert.deepEqual(JSON.parse(calls[1][1].body), {
    entry_id: 42,
    entry_password: '1234'
  });
});

test('client exposes a useful Supabase error message', async () => {
  const client = createGuestbookClient({
    supabaseUrl: 'https://example.supabase.co',
    supabaseAnonKey: 'public-key',
    fetchImpl: async () => new Response(JSON.stringify({ message: '비밀번호가 일치하지 않습니다.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' }
    })
  });

  await assert.rejects(() => client.deleteOwn(42, '0000'), /비밀번호가 일치하지 않습니다/);
});

test('client translates a network failure into a Korean message', async () => {
  const client = createGuestbookClient({
    supabaseUrl: 'https://example.supabase.co',
    supabaseAnonKey: 'public-key',
    fetchImpl: async () => {
      throw new TypeError('Failed to fetch');
    }
  });

  await assert.rejects(() => client.list(), /방명록 서버에 연결하지 못했습니다/);
});
