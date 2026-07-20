# SplitSmart 🚀

Smart expense-splitting for hostel, roommate, and travel groups. Tracks shared expenses and computes the **minimum number of transactions** needed to settle every balance in the group (using a debt-simplification / min-cash-flow algorithm) — not just a running ledger of who-owes-who.

## ✨ Features
*   **User Authentication**: Register and log in securely using your Email and Password (secured using `bcryptjs` password hashing and stateful JWT tokens).
*   **Shared Group Access**: Create groups and invite members using their email addresses. Only group members can view, add, or delete expenses within their groups.
*   **Debt Simplification Algorithm**: Automatically aggregates all group expenses and computes the optimized, minimum set of transactions required to clear all balances.
*   **Flexible Split Strategies**: Supports splitting expenses **Equally**, by **Exact Amounts**, or by **Percentages**.
*   **Interactive Settlements Panel**: View clear, copyable step-by-step instructions on who needs to pay whom and how much.
*   **Group Deletion**: Group creators can easily delete a group, automatically cleaning up all associated expenses, members, and settlements.
*   **Modern Premium UI**: Built with a dark glassmorphic design system, smooth micro-animations, validation banners, and responsive layouts.

---

## 📁 Project Structure

```
splitsmart/
├── backend/     # Express API (Node.js) with JWT Auth & JSON-DB
└── frontend/    # React + Vite Client (Vanilla CSS & Tailwind)
```

---

## 💻 Running Locally

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev         # Runs server in development mode on http://localhost:8080
```

### 2. Frontend Setup (in a second terminal)
```bash
cd frontend
npm install
# Set API endpoint to point to local backend
echo "VITE_API_URL=http://localhost:8080" > .env
npm run dev         # Runs Vite dev server on http://localhost:5173
```

---

## ☁️ Deployment

### AWS Fargate Deployment
This application is designed to run in production inside Docker containers on AWS ECS Fargate:
*   **Frontend**: Served using an Nginx container on ECS Fargate.
*   **Backend**: Served on ECS Fargate with CORS wildcard fallback support.

To build and run the Docker images locally:
```bash
# Build Backend
docker build -t splitsmart-backend ./backend

# Build Frontend
docker build -t splitsmart-frontend ./frontend
```

---

## 🔒 Security Measures
*   **Password Hashing**: Blowfish-based hashing using `bcryptjs`.
*   **Session Token Protection**: Stateless validation with `jsonwebtoken` stored securely in the browser's `localStorage` and sent via `Authorization: Bearer <token>` headers.
*   **Input Sanitization**: Built-in validation helper checking types, ranges, constraints, and array limits.
