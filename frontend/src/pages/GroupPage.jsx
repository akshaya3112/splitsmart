import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Receipt, Scale, Wallet, Loader2, Sparkles, TrendingUp, Trash2 } from "lucide-react";
import { api, ApiClientError } from "../api/client";
import Avatar from "../components/Avatar";
import ExpensesList from "../components/ExpensesList";
import BalancesView from "../components/BalancesView";
import SettleReceipt from "../components/SettleReceipt";
import AddExpenseModal from "../components/AddExpenseModal";
import ErrorBanner from "../components/ErrorBanner";
import { formatRupees } from "../utils/format";

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
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteGroup() {
    if (!window.confirm(`Are you sure you want to delete the group "${group?.name}"? This will permanently delete all members and expenses associated with it.`)) {
      return;
    }
    setDeleting(true);
    setError("");
    try {
      await api.deleteGroup(groupId);
      window.location.href = "/";
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : "Failed to delete the group. Please try again.");
      setDeleting(false);
    }
  }


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
        <Loader2 className="animate-spin text-settle" size={28} />
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

  const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingPayments = settlement ? settlement.transactions.length : 0;
  const transactionsSaved = settlement ? Math.max(0, settlement.stats.naiveUpperBound - settlement.stats.transactionCount) : 0;

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-8 animate-slide-up">
      {/* Header section */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(20,21,27,0.05)] border border-ink/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ink to-ink-soft flex items-center justify-center text-white font-display font-bold text-lg">
                {group.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl text-ink tracking-tight">{group.name}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex -space-x-1.5">
                    {members.map((m) => (
                      <div key={m.id} className="ring-2 ring-white rounded-full">
                        <Avatar name={m.name} id={m.id} size={22} />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-ink/40">
                    {members.length} members
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDeleteGroup}
              disabled={deleting}
              className="inline-flex items-center justify-center w-11 h-11 bg-owe-bg text-owe hover:bg-owe/20 disabled:opacity-50 transition-all rounded-xl border border-owe/10 active:scale-[0.98] shrink-0"
              title="Delete group"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => setShowAddExpense(true)}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-settle to-settle-dim hover:brightness-105 active:scale-[0.98] text-white rounded-xl px-5 py-3 text-sm font-semibold transition-all shadow-[0_4px_12px_rgba(0,179,126,0.2)]"
            >
              <Plus size={16} strokeWidth={2.5} /> Add expense
            </button>
          </div>
        </div>

        {/* Quick stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-ink/5">
          <div className="bg-paper/50 rounded-xl p-4 border border-ink/[0.03]">
            <div className="text-[11px] font-semibold text-ink/40 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={12} className="text-ink/40" /> Total Group Spend
            </div>
            <div className="mt-1 font-display font-bold text-xl text-ink">{formatRupees(totalSpend)}</div>
          </div>

          <div className="bg-paper/50 rounded-xl p-4 border border-ink/[0.03]">
            <div className="text-[11px] font-semibold text-ink/40 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet size={12} className="text-ink/40" /> Settlement Plan
            </div>
            <div className={`mt-1 font-display font-bold text-xl ${pendingPayments === 0 ? "text-settle-dim" : "text-ink"}`}>
              {pendingPayments === 0 ? "Fully Settled" : `${pendingPayments} payment${pendingPayments > 1 ? "s" : ""} left`}
            </div>
          </div>

          <div className="bg-paper/50 rounded-xl p-4 border border-ink/[0.03]">
            <div className="text-[11px] font-semibold text-ink/40 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} className="text-gold" /> Optimization
            </div>
            <div className="mt-1 font-display font-bold text-xl text-ink">
              {transactionsSaved > 0 ? `${transactionsSaved} transaction${transactionsSaved > 1 ? "s" : ""} saved` : "Simplified"}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-2">
          <ErrorBanner message={error} onDismiss={() => setError("")} />
        </div>
      )}

      {/* Tabs navigation & Content */}
      <div className="space-y-4">
        <div className="flex bg-ink/5 rounded-xl p-1 w-fit shadow-[inset_0_1px_2px_rgba(20,21,27,0.05)]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? "bg-white shadow-[0_2px_8px_rgba(20,21,27,0.08)] text-ink font-semibold"
                  : "text-ink/50 hover:text-ink/80"
              }`}
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        <div className="min-h-[250px]">
          {tab === "expenses" && (
            <ExpensesList expenses={expenses} membersById={membersById} onDelete={handleDeleteExpense} />
          )}
          {tab === "balances" && settlement && (
            <BalancesView members={members} netBalances={settlement.netBalances} />
          )}
          {tab === "settle" && settlement && (
            <SettleReceipt settlement={settlement} membersById={membersById} />
          )}
        </div>
      </div>

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
