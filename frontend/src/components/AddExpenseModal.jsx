import { useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";
import ErrorBanner from "./ErrorBanner";
import Avatar from "./Avatar";
import { api, ApiClientError } from "../api/client";

const SPLIT_TYPES = [
  { id: "equal", label: "Equally" },
  { id: "exact", label: "Exact amounts" },
  { id: "percentage", label: "Percentages" },
];

export default function AddExpenseModal({ group, members, onClose, onAdded }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(members[0]?.id || "");
  const [splitType, setSplitType] = useState("equal");
  const [included, setIncluded] = useState(() => Object.fromEntries(members.map((m) => [m.id, true])));
  const [customValues, setCustomValues] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const includedMembers = members.filter((m) => included[m.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const amt = Number(amount);
    if (!description.trim()) return setError("Add a short description for this expense.");
    if (!Number.isFinite(amt) || amt <= 0) return setError("Enter a valid amount greater than 0.");
    if (includedMembers.length === 0) return setError("Select at least one member to split with.");

    let participants;
    if (splitType === "equal") {
      participants = includedMembers.map((m) => ({ memberId: m.id }));
    } else if (splitType === "exact") {
      participants = includedMembers.map((m) => ({ memberId: m.id, share: Number(customValues[m.id] || 0) }));
    } else {
      participants = includedMembers.map((m) => ({ memberId: m.id, percentage: Number(customValues[m.id] || 0) }));
    }

    setSubmitting(true);
    try {
      await api.addExpense({
        groupId: group.id,
        description: description.trim(),
        amount: Math.round(amt),
        paidBy,
        splitType,
        participants,
      });
      onAdded();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Couldn't add the expense. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title="Add expense" onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="text-xs font-medium text-ink/50 uppercase tracking-wide">Description</label>
            <input
              autoFocus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Groceries, auto fare, movie tickets…"
              maxLength={140}
              className="mt-1.5 w-full rounded-xl border border-ink/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-settle/40 focus:border-settle"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/50 uppercase tracking-wide">Amount (₹)</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="1"
              placeholder="900"
              className="mt-1.5 w-full rounded-xl border border-ink/10 px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-settle/40 focus:border-settle"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-ink/50 uppercase tracking-wide">Paid by</label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {members.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaidBy(m.id)}
                className={`flex items-center gap-2 rounded-full pl-1.5 pr-3.5 py-1.5 text-sm border transition ${
                  paidBy === m.id ? "border-settle bg-settle-bg text-settle-dim font-medium" : "border-ink/10 text-ink/60 hover:border-ink/20"
                }`}
              >
                <Avatar name={m.name} id={m.id} size={22} />
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-ink/50 uppercase tracking-wide">Split</label>
            <div className="flex bg-ink/5 rounded-lg p-0.5">
              {SPLIT_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSplitType(t.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                    splitType === t.id ? "bg-white shadow-sm text-ink" : "text-ink/45"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2.5 space-y-1.5 max-h-52 overflow-y-auto">
            {members.map((m) => (
              <div
                key={m.id}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 border ${
                  included[m.id] ? "border-ink/10" : "border-ink/5 opacity-40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!included[m.id]}
                  onChange={(e) => setIncluded((s) => ({ ...s, [m.id]: e.target.checked }))}
                  className="accent-settle"
                />
                <Avatar name={m.name} id={m.id} size={24} />
                <span className="text-sm flex-1">{m.name}</span>
                {splitType !== "equal" && included[m.id] && (
                  <input
                    type="number"
                    placeholder={splitType === "exact" ? "₹ amount" : "%"}
                    value={customValues[m.id] || ""}
                    onChange={(e) => setCustomValues((s) => ({ ...s, [m.id]: e.target.value }))}
                    className="w-24 rounded-lg border border-ink/10 px-2 py-1 text-sm font-mono text-right"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-ink text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-ink-soft transition disabled:opacity-60"
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          Add expense
        </button>
      </form>
    </Modal>
  );
}
