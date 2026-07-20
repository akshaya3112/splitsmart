import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import GroupPage from "./pages/GroupPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-paper">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/groups/:groupId" element={<GroupPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
