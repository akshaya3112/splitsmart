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
    <div className="space-y-3 animate-slide-up">
      {expenses.map((e) => {
        const payer = membersById[e.paidBy];
        return (
          <div
            key={e.id}
            className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border border-ink/5 shadow-[0_2px_8px_rgba(20,21,27,0.02)] hover:shadow-[0_8px_20px_-6px_rgba(20,21,27,0.06)] hover:border-ink/10 transition-all duration-200 group"
          >
            <Avatar name={payer?.name || "?"} id={e.paidBy} size={38} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink truncate leading-snug">{e.description}</div>
              <div className="text-xs text-ink/45 mt-0.5">
                Paid by <span className="font-semibold text-ink/75">{payer?.name}</span> · split {e.splitAmong.length} ways
              </div>
            </div>
            <div className="text-right shrink-0 pr-1">
              <div className="font-mono font-bold text-ink text-base">{formatRupees(e.amount)}</div>
            </div>
            <button
              onClick={() => onDelete(e.id)}
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150 w-8 h-8 flex items-center justify-center rounded-xl text-ink/25 hover:text-owe hover:bg-owe-bg shrink-0"
              aria-label="Delete expense"
            >
              <Trash2 size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
