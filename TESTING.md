# Testing

| Tool | Scope | Command |
|------|--------|---------|
| **Jest** + **React Testing Library** | Components & utilities | `npm run test:unit` |
| **Supertest** | Laravel REST API (`/api/v1`) | `npm run test:api` |
| **Playwright** | Browser E2E | `npm run test:e2e` |
| **PHPUnit** | Laravel backend (in-process) | `cd backend && composer test` |

## Setup

```bash
npm install
npx playwright install chromium
```

## Unit & component tests

```bash
npm run test:unit
```

Tests live in `__tests__/`.

## API tests (Supertest)

Hits the live or local API. Default: `https://admin.rajeshcodes.in/api/v1`.

```bash
# Production API
npm run test:api

# Local API
API_TEST_URL=http://127.0.0.1:8001/api/v1 npm run test:api
```

Optional env (see `.env.test.example`):

- `API_TEST_URL`
- `API_TEST_USER_EMAIL` / `API_TEST_USER_PASSWORD`

## E2E (Playwright)

Starts `npm run dev` automatically unless `PLAYWRIGHT_SKIP_WEBSERVER=1`.

```bash
npm run test:e2e
npm run test:e2e:ui   # interactive UI
```

```bash
PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e   # app already running
```

## Run everything

```bash
npm run test:all
cd backend && composer test
```
