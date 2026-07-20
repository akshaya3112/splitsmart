import { Trash2 } from "lucide-react";
import { formatRupees } from "../utils/format";
import Avatar from "./Avatar";
import EmptyState from "./EmptyState";
import { Receipt } from "lucide-react";

export default function ExpensesList({ expenses, membersById, onDelete }) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No expenses yet"
        subtitle="Add your first expense to start tracking who owes what."
      />
    );
  }

  return (
    <div className="space-y-2 animate-slide-up">
      {expenses.map((e) => {
        const payer = membersById[e.paidBy];
        return (
          <div key={e.id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-card group">
            <Avatar name={payer?.name || "?"} id={e.paidBy} size={34} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-ink truncate">{e.description}</div>
              <div className="text-xs text-ink/40">
                {payer?.name} paid · split {e.splitAmong.length} ways
              </div>
            </div>
            <div className="font-mono font-semibold text-ink/80">{formatRupees(e.amount)}</div>
            <button
              onClick={() => onDelete(e.id)}
              className="opacity-0 group-hover:opacity-100 transition w-8 h-8 flex items-center justify-center rounded-lg text-ink/25 hover:text-owe hover:bg-owe-bg shrink-0"
              aria-label="Delete expense"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
