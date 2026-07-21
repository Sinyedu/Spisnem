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
| Auth | `/api/auth` | login is open, `/me` needs a token |
| Public restaurants and menu | `/api/public/restaurants` | none |
| Public queue | `/api/public/queue` | public token in the URL |
| Public orders | `/api/public/orders` | public token in the URL |
| Staff queue | `/api/staff/queue` | JWT |
| Staff orders | `/api/staff/orders` | JWT |
| Staff menu | `/api/staff/menu` | JWT, editing requires the `owner` role |
| Staff dashboard | `/api/staff/dashboard` | JWT |

Send the token as `Authorization: Bearer <token>`. Staff endpoints always use the restaurant id
from the token, never one sent by the client.

Errors use one shape:

```json
{ "error": { "code": "ERROR_CODE", "message": "Readable error message" } }
```
