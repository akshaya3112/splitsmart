# 💸 SplitSmart

SplitSmart is a full-stack expense-sharing web application that helps hostel students, roommates, and friends manage shared expenses efficiently. It automatically calculates the minimum number of transactions required to settle all balances using a debt simplification (Min Cash Flow) algorithm.

🌐 **Live Demo:** https://splitsmart-np65.vercel.app

---

## ✨ Features

- 🔐 JWT-based User Authentication
- 👥 Shared Group Access
- ➕ Create and Manage Groups
- 💰 Add & Delete Expenses
- 📊 Automatic Balance Calculation
- 🔄 Debt Simplification Algorithm
- 🗑️ Delete Groups
- 📱 Responsive User Interface
- ☁️ Cloud Deployment

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JWT Authentication

### Database
- MongoDB Atlas

### Deployment
- Frontend: Vercel
- Backend: Render

---

# 📂 Project Structure

```text
splitsmart/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/akshaya3112/splitsmart.git
cd splitsmart
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

## Backend Setup

```bash
cd backend
npm install
npm start
```

Runs on:

```
http://localhost:8080
```

---

# ⚙️ Environment Variables

### Frontend (.env)

```env
VITE_API_URL=https://splitsmart-backend-8ulm.onrender.com
```

### Backend (.env)

```env
PORT=8080
JWT_SECRET=your_secret_key
MONGODB_URI=your_mongodb_connection_string
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get logged-in user |

---

## Groups

| Method | Endpoint |
|---------|----------|
| GET | `/api/groups` |
| POST | `/api/groups` |
| DELETE | `/api/groups/:groupId` |

---

## Expenses

| Method | Endpoint |
|---------|----------|
| GET | `/api/expenses/group/:groupId` |
| POST | `/api/expenses` |
| DELETE | `/api/expenses/:expenseId` |

---

## Settlements

| Method | Endpoint |
|---------|----------|
| GET | `/api/settlements/group/:groupId` |

---

# 🧮 Debt Simplification Algorithm

SplitSmart uses a **Min Cash Flow (Debt Simplification)** algorithm to minimize the number of transactions required to settle balances within a group.

Instead of requiring every member to pay each individual debt, the algorithm computes the smallest possible set of payments that clears all balances efficiently.

---

# 🌍 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

# 📸 Screenshots

Login page
<img width="1902" height="977" alt="image" src="https://github.com/user-attachments/assets/2394a5bd-daf0-4d38-894a-4870f545d6b8" />

Dashboard
<img width="1902" height="968" alt="image" src="https://github.com/user-attachments/assets/6cc97986-6505-4a20-94cc-8aa5f4dfb659" />

<img width="1917" height="972" alt="image" src="https://github.com/user-attachments/assets/b1b1fc47-28af-423a-b899-498f05f6f220" />

<img width="1915" height="980" alt="image" src="https://github.com/user-attachments/assets/9b8e84c5-5d90-4842-b0a3-2e1345c7c3ad" />



# 🎯 Future Improvements

- 📧 Email Invitations
- 🌙 Dark Mode
- 💱 Multi-Currency Support
- 📈 Expense Analytics
- 📄 Export Reports (PDF/Excel)
- 📱 Mobile Application

---

# 👨‍💻 Author

**Akshaya Thippireddy**

GitHub: https://github.com/akshaya3112

---

# ⭐ If you found this project helpful, consider giving it a star!
