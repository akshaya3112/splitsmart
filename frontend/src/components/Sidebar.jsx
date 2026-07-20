import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Users, Receipt, LogOut } from "lucide-react";
import { api } from "../api/client";
import CreateGroupModal from "./CreateGroupModal";

export default function Sidebar({ refreshKey, currentUser, onLogout }) {
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .listGroups()
      .then(({ groups }) => !cancelled && setGroups(groups))
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [refreshKey, showModal]);

  return (
    <aside className="w-64 shrink-0 bg-ink text-white/90 flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-settle to-[#10e2a3] flex items-center justify-center shadow-[0_4px_12px_rgba(0,179,126,0.3)] transform hover:rotate-12 transition-transform duration-300">
          <Receipt size={18} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">SplitSmart</span>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="mx-4 flex items-center justify-center gap-2 bg-gradient-to-r from-settle to-settle-dim hover:from-settle/90 hover:to-settle-dim/90 text-white rounded-xl py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] shadow-[0_4px_14px_rgba(0,179,126,0.25)] hover:shadow-[0_6px_20px_rgba(0,179,126,0.35)]"
      >
        <Plus size={16} /> New group
      </button>

      <div className="mt-8 px-6 text-xs font-semibold text-white/40 uppercase tracking-widest">Your groups</div>
      <nav className="flex-1 overflow-y-auto px-3 mt-3 space-y-1.5">
        {loading && (
          <div className="px-2 py-8 text-center text-white/30 text-sm animate-pulse">Loading…</div>
        )}
        {!loading && groups.length === 0 && (
          <div className="px-4 py-6 text-white/35 text-sm leading-relaxed border border-white/5 rounded-xl bg-white/[0.02]">
            No groups yet. Create one to start splitting expenses.
          </div>
        )}
        {groups.map((g) => (
          <NavLink
            key={g.id}
            to={`/groups/${g.id}`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-settle/15 to-transparent text-white font-semibold border-l-4 border-settle shadow-[inset_1px_0_0_rgba(255,255,255,0.05)] pl-3"
                  : "text-white/50 pl-4 hover:bg-white/5 hover:text-white/90"
              }`
            }
          >
            <Users size={16} className="shrink-0" />
            <span className="truncate">{g.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User profile & Log Out */}
      <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between gap-3 bg-white/[0.01]">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-white/80 truncate">{currentUser?.name}</div>
          <div className="text-[10px] text-white/40 truncate mt-0.5">{currentUser?.email}</div>
        </div>
        <button
          onClick={onLogout}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-white/45 hover:text-owe hover:bg-owe-bg/10 shrink-0 transition"
          title="Log Out"
        >
          <LogOut size={16} />
        </button>
      </div>

      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onCreated={(id) => {
            setShowModal(false);
            navigate(`/groups/${id}`);
          }}
        />
      )}
    </aside>
  );
}
