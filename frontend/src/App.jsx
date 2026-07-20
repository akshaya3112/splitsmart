import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import GroupPage from "./pages/GroupPage";
import LoginPage from "./pages/LoginPage";
import { api } from "./api/client";
import { Loader2 } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("splitsmart_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api.getMe()
      .then((data) => {
        setCurrentUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("splitsmart_token");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleLogout() {
    localStorage.removeItem("splitsmart_token");
    setCurrentUser(null);
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-settle" size={32} />
        <span className="text-white/45 text-xs font-bold tracking-widest uppercase">Loading SplitSmart…</span>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onAuthSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-paper font-sans text-ink antialiased">
        <Sidebar currentUser={currentUser} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/groups/:groupId" element={<GroupPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
