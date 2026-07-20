# SplitSmart

Smart expense-splitting for hostel and roommate groups. Tracks shared expenses and
computes the **minimum number of transactions** needed to settle every balance in
the group (a debt-simplification / min-cash-flow algorithm) — not just a running
ledger of who-owes-who.

## Project structure

```
splitsmart/
├── backend/     Express API (Node.js) — see backend/README.md
└── frontend/    React + Tailwind UI  — see frontend/README.md
```

## Running locally

**Backend:**
```
cd backend
npm install
npm start          # runs on http://localhost:8080
```

**Frontend** (in a second terminal):
```
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8080" > .env
npm run dev         # runs on http://localhost:5173
```

## Deploying to AWS

See `SplitSmart_AWS_Deployment_Guide.docx` for the full step-by-step walkthrough
(VPC → ECS Fargate → ALB for the backend, S3 → CloudFront for the frontend), with
every manual AWS Console action clearly marked.

## Project report

See `SplitSmart_Final_Report.docx` for the syllabus-to-project mapping, the
algorithm writeup, security measures, and multi-cloud comparison.
