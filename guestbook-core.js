(function (root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.GuestbookCore = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const LIMITS = {
    name: 30,
    message: 500
  };

  function isGuestbookConfigured(config) {
    return Boolean(
      config &&
      config.enabled &&
      config.supabaseUrl &&
      config.supabaseAnonKey
    );
  }

  function validateEntry(entry) {
    const value = {
      name: String(entry?.name || '').trim(),
      message: String(entry?.message || '').trim(),
      password: String(entry?.password || '').trim()
    };
    const errors = {};

    if (!value.name || value.name.length > LIMITS.name) {
      errors.name = `이름은 1자 이상 ${LIMITS.name}자 이하로 입력해 주세요.`;
    }
    if (!value.message || value.message.length > LIMITS.message) {
      errors.message = `메시지는 1자 이상 ${LIMITS.message}자 이하로 입력해 주세요.`;
    }
    if (!/^\d{4}$/.test(value.password)) {
      errors.password = '삭제 비밀번호는 숫자 4자리로 입력해 주세요.';
    }

    return {
      valid: Object.keys(errors).length === 0,
      value,
      errors
    };
  }

  function formatEntryDate(dateString) {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timeZone: 'Asia/Seoul'
    }).format(new Date(dateString));
  }

  function createGuestbookClient(options) {
    const baseUrl = String(options.supabaseUrl || '').replace(/\/+$/, '');
    const key = options.supabaseAnonKey;
    const fetchImpl = options.fetchImpl || fetch;
    const headers = {
      apikey: key,
      Authorization: `Bearer ${key}`
    };

    async function request(path, requestOptions = {}) {
      let response;
      try {
        response = await fetchImpl(`${baseUrl}/rest/v1/${path}`, {
          ...requestOptions,
          headers: {
            ...headers,
            ...requestOptions.headers
          }
        });
      } catch {
        throw new Error('방명록 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      }

      if (!response.ok) {
        let detail = '방명록 요청을 처리하지 못했습니다.';
        try {
          const body = await response.json();
          detail = body.message || body.error_description || detail;
        } catch {
          // Keep the generic message when Supabase does not return JSON.
        }
        throw new Error(detail);
      }

      if (response.status === 204) return null;
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }

    function postRpc(name, body) {
      return request(`rpc/${name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    }

    return {
      list() {
        const query = new URLSearchParams({
          select: 'id,name,message,created_at',
          order: 'created_at.desc'
        });
        return request(`guestbook_entries?${query.toString()}`);
      },

      create(entry) {
        return postRpc('create_guestbook_entry', {
          entry_name: entry.name,
          entry_message: entry.message,
          entry_password: entry.password
        });
      },

      deleteOwn(id, password) {
        return postRpc('delete_guestbook_entry', {
          entry_id: id,
          entry_password: password
        });
      }
    };
  }

  return {
    LIMITS,
    createGuestbookClient,
    formatEntryDate,
    isGuestbookConfigured,
    validateEntry
  };
});
