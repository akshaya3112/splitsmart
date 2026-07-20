# SplitSmart backend

Express API with a debt-simplification algorithm at its core.

## Local development
```
npm install
npm start
```
Runs on `http://localhost:8080`. Health check: `GET /health`.

## Environment variables
Copy `.env.example` to `.env` and adjust `CORS_ORIGIN` to your frontend's URL in production.

## Key files
- `src/algorithms/simplifyDebts.js` — the core settlement algorithm
- `src/routes/` — groups, expenses, settlements endpoints
- `src/db.js` — JSON-file data store (swap for DynamoDB in production — see the deployment guide's "Known limitations" section)
- `Dockerfile` — multi-stage, non-root, production image

## API summary
| Method | Path | Purpose |
|---|---|---|
| POST | /api/groups | Create a group with initial members |
| GET | /api/groups | List groups |
| GET | /api/groups/:id | Get a group + its members |
| POST | /api/groups/:id/members | Add a member to a group |
| POST | /api/expenses | Add an expense (split equal/exact/percentage) |
| GET | /api/expenses/group/:id | List a group's expenses |
| DELETE | /api/expenses/:id | Delete an expense |
| GET | /api/settlements/group/:id | Get net balances + minimized settlement plan |
