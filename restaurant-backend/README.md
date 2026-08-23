# Spisnem backend

REST API for the Spisnem restaurant app. It serves two clients:

- a customer phone app (browse restaurants and menus, join the queue, place orders)
- a staff dashboard (queue handling, orders, menu editing, daily numbers)

Customers do not have accounts. They get a one-time public token when they join the queue or
place an order, and use that token to follow their status. Only staff log in.

## Requirements

- Node.js 22+
- pnpm
- PostgreSQL 14+

## Install

```bash
pnpm install
```

## Environment

```bash
cp .env.example .env
```

Set at least `DATABASE_URL` and `JWT_SECRET` (minimum 16 characters). Create the database first,
for example `createdb restaurant_app`.

## Database

```bash
pnpm db:migrate
pnpm db:seed
```

The seed is safe to run more than once.

## Run

```bash
pnpm dev      # development with reload
pnpm build    # compile to dist/
pnpm start    # run the compiled server
pnpm typecheck
pnpm test
```

## Seeded login

```
email:    admin@spisnem.dk
password: development-password
```

Both come from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`.

## API groups

| Group | Base path | Auth |
| --- | --- | --- |
| Health | `/api/health` | none |
| Staff auth | `/api/auth` | login is open, `/me` needs a token |
| Customer auth | `/api/customer/auth` | handled by Better Auth (session cookie) |
| Public restaurants and menu | `/api/public/restaurants` | none |
| Public queue | `/api/public/queue` | public token in the URL |
| Public orders | `/api/public/orders` | public token in the URL |
| Staff queue | `/api/staff/queue` | JWT |
| Staff orders | `/api/staff/orders` | JWT |
| Staff menu | `/api/staff/menu` | JWT, editing requires the `owner` role |
| Staff dashboard | `/api/staff/dashboard` | JWT |

Send the token as `Authorization: Bearer <token>`. Staff endpoints always use the restaurant id
from the token, never one sent by the client.

## Customer accounts

Staff and customers are two separate systems on purpose.

- **Staff** log in at `/api/auth` with bcrypt and a JWT, and are tied to a restaurant
  through `restaurant_users`. Unchanged.
- **Customers** use [Better Auth](https://better-auth.com) at `/api/customer/auth`, with
  email and password plus Google and Apple. It keeps its own tables — `user`, `session`,
  `account`, `verification` — created by migration `004_customer_auth.sql`. Note that the
  quoted `user` table is the customer one and is unrelated to the staff `users` table.

Social providers are optional: a provider only switches on when both its client id and
client secret are set, so a developer with none of them still gets email and password
login. Configuration lives in `src/modules/customer-auth/customer-auth.config.ts`.

To regenerate the schema after changing that configuration, use `getMigrations` from
`better-auth/db/migration` and write its `compileMigrations()` output to a new numbered
file in `src/database/migrations/` — do not let Better Auth write to the database
directly, or it will bypass the migration tracking in `migrate.ts`.

Errors use one shape:

```json
{ "error": { "code": "ERROR_CODE", "message": "Readable error message" } }
```
