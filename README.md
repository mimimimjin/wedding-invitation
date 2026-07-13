# Modern Minimal 모바일 청첩장

정적 모바일 청첩장과 Supabase 기반 방명록입니다.

## 방명록 연결

1. [Supabase](https://supabase.com/)에서 프로젝트를 생성합니다.
2. Supabase SQL Editor에서 `supabase/guestbook.sql` 내용을 실행합니다.
3. Supabase 프로젝트 설정의 Project URL과 공개용 `anon` 키를 확인합니다.
4. `config.js`의 `guestbook` 값을 채웁니다.

```js
guestbook: {
  enabled: true,
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_ANON_KEY"
}
```

`anon` 키는 정적 웹사이트에서 사용하는 공개용 키입니다. 관리자용
`service_role` 키는 절대로 `config.js`에 넣거나 Git에 커밋하면 안 됩니다.

## 관리자 CLI

`.env.example`을 참고해 프로젝트 루트에 `.env`를 만들고 관리자용 값을
입력합니다.

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

방명록 목록 조회:

```bash
node scripts/guestbook-admin.mjs list
```

방명록 ID로 삭제:

```bash
node scripts/guestbook-admin.mjs delete 42
```

Supabase Dashboard의 Table Editor에서 `guestbook_entries` 행을 직접
삭제해도 됩니다.

## 테스트

Node.js가 설치된 환경에서 실행합니다.

```bash
npm test
```

이 작업 환경처럼 `npm`이 없는 경우에는 다음처럼 실행할 수 있습니다.

```bash
node --test
```

## Supabase 자동 깨우기

무료 Supabase 프로젝트가 inactivity로 pause되지 않도록 GitHub Actions가
하루 한 번 방명록 REST API를 조회합니다. 데이터는 수정하지 않고
`guestbook_entries?select=id&limit=1`만 호출합니다.

GitHub repository settings의 `Secrets and variables` > `Actions`에 다음
repository secrets를 추가합니다.

```text
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

설정 후 GitHub `Actions` 탭에서 `Supabase Keepalive` workflow를 수동 실행해
초기 연결을 확인할 수 있습니다.

## Node.js가 설치되지 않은 Mac에서 관리자 CLI 실행

터미널에서 `node: command not found`가 표시되고 Codex 앱이 설치되어 있다면,
Codex 앱에 포함된 Node.js로 관리자 CLI를 실행할 수 있습니다.

방명록 목록 조회:

```bash
/Applications/Codex.app/Contents/Resources/node scripts/guestbook-admin.mjs list
```

방명록 ID로 삭제:

```bash
/Applications/Codex.app/Contents/Resources/node scripts/guestbook-admin.mjs delete 42
```
