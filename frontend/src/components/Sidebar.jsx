import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Users, Receipt } from "lucide-react";
import { api } from "../api/client";
import CreateGroupModal from "./CreateGroupModal";

export default function Sidebar({ refreshKey }) {
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
      <div className="px-5 py-6 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-settle flex items-center justify-center shadow-pop">
          <Receipt size={17} className="text-ink" strokeWidth={2.5} />
        </div>
        <span className="font-display font-semibold text-lg tracking-tight">SplitSmart</span>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="mx-4 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 rounded-xl py-2.5 text-sm font-medium transition"
      >
        <Plus size={16} /> New group
      </button>

      <div className="mt-6 px-5 text-xs font-medium text-white/35 uppercase tracking-wide">Your groups</div>
      <nav className="flex-1 overflow-y-auto px-3 mt-2 space-y-1">
        {loading && (
          <div className="px-2 py-8 text-center text-white/30 text-sm">Loading…</div>
        )}
        {!loading && groups.length === 0 && (
          <div className="px-3 py-6 text-white/35 text-sm leading-relaxed">
            No groups yet. Create one to start splitting expenses.
          </div>
        )}
        {groups.map((g) => (
          <NavLink
            key={g.id}
            to={`/groups/${g.id}`}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
                isActive ? "bg-white/15 text-white font-medium" : "text-white/60 hover:bg-white/8 hover:text-white/90"
              }`
            }
          >
            <Users size={15} className="shrink-0" />
            <span className="truncate">{g.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 text-[11px] text-white/25 border-t border-white/10">
        SplitSmart — settle up smarter
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
