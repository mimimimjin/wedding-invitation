# Guestbook Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Supabase-backed visitor guestbook and a local administrator CLI to the static wedding invitation.

**Architecture:** Keep the site static and call Supabase REST/RPC endpoints with `fetch`. Put validation and request construction in a small testable guestbook core module, enforce password hashing and permissions in Supabase SQL, and reserve the service-role key for the local CLI.

**Tech Stack:** Vanilla HTML/CSS/JavaScript, Supabase PostgreSQL/REST/RPC, Node.js built-in test runner

---

### Task 1: Guestbook Core

**Files:**
- Create: `guestbook-core.js`
- Create: `tests/guestbook-core.test.js`
- Create: `package.json`

**Steps:**
1. Write failing tests for configuration checks, input validation, date formatting, and REST/RPC requests.
2. Run `npm test` and confirm failures caused by the missing module.
3. Implement the smallest reusable guestbook core module.
4. Run `npm test` and confirm all tests pass.

### Task 2: Guestbook Visitor UI

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `config.js`
- Modify: `script.js`

**Steps:**
1. Add the semantic guestbook section and load `guestbook-core.js`.
2. Add styles matching the existing modern-minimal design.
3. Add public Supabase configuration placeholders.
4. Wire list, create, delete, loading, empty, and error states through the core module.
5. Run `npm test`.

### Task 3: Supabase Database Setup

**Files:**
- Create: `supabase/guestbook.sql`

**Steps:**
1. Create the table with private password hash column.
2. Enable RLS and allow anonymous reads only.
3. Add security-definer create and password-delete RPC functions with validation.
4. Grant the minimum required permissions.
5. Review SQL for public privilege leakage.

### Task 4: Administrator CLI

**Files:**
- Create: `scripts/guestbook-admin.mjs`
- Create: `.env.example`
- Create: `.gitignore`

**Steps:**
1. Add tests for administrator command parsing and request behavior.
2. Run `npm test` and confirm failures.
3. Implement `list` and `delete <id>` commands using the service-role key.
4. Add `.env` loading without external dependencies.
5. Run `npm test`.

### Task 5: Setup Documentation and Verification

**Files:**
- Create: `README.md`

**Steps:**
1. Document Supabase project creation, SQL application, browser configuration, and CLI setup.
2. Run `npm test`.
3. Serve the static site locally and verify the guestbook layout and setup notice in the browser.
4. Inspect `git diff` and confirm no secrets are present.
