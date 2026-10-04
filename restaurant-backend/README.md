# Spisnem backend

REST API for Spisnem, a restaurant queue app. It serves two clients:

- the guest phone app: find restaurants, see live waits, join a queue, follow your place live
- the staff dashboard: run the queue and tables, edit the menu, read the day's numbers

Guests don't need an account to queue. Joining returns a one-time public token they use to
follow their ticket. Signed-in guests (Better Auth) also get favourites and visit history.

## Requirements

- Node.js 22+
- pnpm
- MongoDB 7+ (local, Docker, or Atlas)

## Install and run

```bash
pnpm install
cp .env.example .env     # set JWT_SECRET (16+ chars); MONGODB_URI defaults to localhost
pnpm db:seed             # the "spisnem" restaurant, its owner login and a menu
pnpm db:seed:restaurants # invented demo venues for the map
pnpm dev
```

There are no migrations: the app creates its MongoDB indexes on startup
(`src/database/indexes.ts`). Seeds are safe to run more than once.

```bash
pnpm build | pnpm start | pnpm typecheck | pnpm test
```

`pnpm test` starts a throwaway in-memory MongoDB, so it needs no database of its own. The
first run downloads a MongoDB binary.

## Seeded login

```
email:    admin@spisnem.dk
password: development-password
```

Both come from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`.

## How waits are estimated

`src/modules/queue/wait-estimator.ts` turns a snapshot of the line into minutes per guest:

1. **Tables** – if the restaurant has tables set up, it simulates which guest gets which
   table next, using how long tables really stay occupied (learned from `table_freed` events).
2. **Recent pace** – otherwise, minutes per party from how many parties were seated in the
   last hour, blended with the restaurant's own `averageWaitMinutes` while history is thin.
3. **Overrides** – a wait the host typed in by hand always wins.

Every guest's quote is stored at join (`quotedWaitMinutes`). Insights compares it with when
they were really called, so you can see how accurate the queue is.

## API groups

| Group | Base path | Auth |
| --- | --- | --- |
| Health | `/api/health` | none |
| Staff auth | `/api/auth` | login is open, `/me` needs a token |
| Customer auth | `/api/customer/auth` | Better Auth (session cookie) |
| Customer favourites and visits | `/api/customer` | Better Auth session |
| Public restaurants, map, menu, wait estimate | `/api/public/restaurants` | none |
| Public queue ticket and live stream | `/api/public/queue/:token` | public token in the URL |
| Staff queue | `/api/staff/queue` | JWT |
| Staff tables | `/api/staff/tables` | JWT; layout changes need `owner` |
| Staff menu | `/api/staff/menu` | JWT; editing needs `owner` |
| Staff dashboard and insights | `/api/staff/dashboard`, `/api/staff/insights` | JWT |
| Staff live stream | `/api/staff/stream?access_token=…` | JWT in the query string |

Send the staff token as `Authorization: Bearer <token>`. Staff endpoints always use the
restaurant id from the token, never one sent by the client. The live streams are
server-sent events; with several server instances they would need MongoDB change streams.

## Collections

`restaurants`, `staff_users`, `queue_entries`, `queue_events` (the queue diary),
`restaurant_tables`, `menu_categories`, `menu_items`, `favourites`. Better Auth keeps its own
`user`, `session`, `account` and `verification` collections through its MongoDB adapter.
Document shapes are in `src/types/documents.ts`. Ids are UUID strings.

Errors use one shape:

```json
{ "error": { "code": "ERROR_CODE", "message": "Readable error message" } }
```
