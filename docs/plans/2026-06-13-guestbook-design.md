# Guestbook Design

## Goal

Add a shared guestbook to the static wedding invitation. Visitors can write and
delete their own messages with a four-digit password, while the owner can list
and delete any message from a local command-line program or the Supabase
dashboard.

## Architecture

The existing invitation remains a static site. It talks directly to Supabase
through its REST and RPC endpoints using the public anonymous key.

Supabase owns all privileged behavior:

- The public table exposes only `id`, `name`, `message`, and `created_at`.
- Direct public inserts and deletes are blocked by row-level security.
- A `create_guestbook_entry` RPC validates input and stores a password hash.
- A `delete_guestbook_entry` RPC compares the submitted password before
  deleting an entry.
- The local administrator CLI uses a Supabase service-role key stored only in a
  local `.env` file.

## User Experience

The guestbook section appears below the account section and above the footer.
It contains:

- A compact form for name, message, and four-digit deletion password.
- A newest-first list of messages with localized dates.
- A delete button on each message that opens a password prompt.
- Clear loading, empty, success, and failure states.

The guestbook is hidden when its configuration is disabled. If Supabase is not
configured, the section shows a setup notice instead of making requests.

## Data Flow

1. Page load fetches public guestbook rows through the Supabase REST endpoint.
2. Form submission calls the create RPC. The database validates lengths and
   hashes the password.
3. Successful submission clears the form and reloads the list.
4. Visitor deletion calls the delete RPC with the entry ID and password.
5. Administrator commands use the service-role key to list or delete rows.

## Security

- The browser never receives password hashes or the service-role key.
- User-controlled strings are rendered with `textContent`, not HTML.
- SQL functions validate name, message, and password lengths.
- Row-level security blocks direct anonymous writes.
- `.env` is ignored by Git.

Basic abuse protection is limited to database validation. CAPTCHA or
rate-limiting can be added later if public spam becomes a problem.

## Testing

Node's built-in test runner covers validation, date formatting, configuration
checks, and Supabase request construction. Browser verification covers layout,
form states, and the unconfigured setup notice. Live database behavior is
verified after the owner applies the provided SQL and fills in Supabase keys.
