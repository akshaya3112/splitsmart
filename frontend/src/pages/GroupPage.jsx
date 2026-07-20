import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Receipt, Scale, Wallet, Loader2 } from "lucide-react";
import { api, ApiClientError } from "../api/client";
import Avatar from "../components/Avatar";
import ExpensesList from "../components/ExpensesList";
import BalancesView from "../components/BalancesView";
import SettleReceipt from "../components/SettleReceipt";
import AddExpenseModal from "../components/AddExpenseModal";
import ErrorBanner from "../components/ErrorBanner";

const TABS = [
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "balances", label: "Balances", icon: Scale },
  { id: "settle", label: "Settle up", icon: Wallet },
];

export default function GroupPage() {
  const { groupId } = useParams();
  const [tab, setTab] = useState("expenses");
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settlement, setSettlement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddExpense, setShowAddExpense] = useState(false);

  const membersById = Object.fromEntries(members.map((m) => [m.id, m]));

  const loadAll = useCallback(async () => {
    setError("");
    try {
      const [groupRes, expensesRes, settlementRes] = await Promise.all([
        api.getGroup(groupId),
        api.listExpenses(groupId),
        api.getSettlement(groupId),
      ]);
      setGroup(groupRes.group);
      setMembers(groupRes.members);
      setExpenses(expensesRes.expenses);
      setSettlement(settlementRes);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Couldn't load this group.");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    setLoading(true);
    loadAll();
  }, [loadAll]);

  async function handleDeleteExpense(expenseId) {
    try {
      await api.deleteExpense(expenseId);
      loadAll();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Couldn't delete that expense.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-24">
        <Loader2 className="animate-spin text-ink/30" size={22} />
      </div>
    );
  }

  if (error && !group) {
    return (
      <div className="max-w-lg mx-auto mt-16">
        <ErrorBanner message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display font-bold text-2xl text-ink">{group.name}</h1>
        <button
          onClick={() => setShowAddExpense(true)}
          className="flex items-center gap-1.5 bg-ink text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-ink-soft transition shadow-card"
        >
          <Plus size={16} /> Add expense
        </button>
      </div>
      <div className="flex -space-x-2 mb-6">
        {members.map((m) => (
          <div key={m.id} className="ring-2 ring-paper rounded-full">
            <Avatar name={m.name} id={m.id} size={28} />
          </div>
        ))}
        <span className="ml-3 text-sm text-ink/40 self-center">{members.length} members</span>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorBanner message={error} onDismiss={() => setError("")} />
        </div>
      )}

      <div className="flex bg-ink/5 rounded-xl p-1 mb-6 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t.id ? "bg-white shadow-sm text-ink" : "text-ink/45 hover:text-ink/70"
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "expenses" && (
        <ExpensesList expenses={expenses} membersById={membersById} onDelete={handleDeleteExpense} />
      )}
      {tab === "balances" && settlement && (
        <BalancesView members={members} netBalances={settlement.netBalances} />
      )}
      {tab === "settle" && settlement && (
        <SettleReceipt settlement={settlement} membersById={membersById} />
      )}

      {showAddExpense && (
        <AddExpenseModal
          group={group}
          members={members}
          onClose={() => setShowAddExpense(false)}
          onAdded={() => {
            setShowAddExpense(false);
            loadAll();
          }}
        />
      )}
    </div>
  );
}
