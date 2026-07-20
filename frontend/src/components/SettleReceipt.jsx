import { ArrowRight, CheckCircle2 } from "lucide-react";
import { formatRupees } from "../utils/format";
import Avatar from "./Avatar";
import EmptyState from "./EmptyState";

export default function SettleReceipt({ settlement, membersById }) {
  const { transactions, stats } = settlement;
  const saved = Math.max(0, stats.naiveUpperBound - stats.transactionCount);

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title="Everyone's settled up"
        subtitle="No outstanding balances in this group right now."
      />
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-4 mb-5">
        <div className="bg-settle-bg text-settle-dim rounded-2xl px-4 py-3 flex-1">
          <div className="font-display font-bold text-2xl">{stats.transactionCount}</div>
          <div className="text-xs font-medium opacity-70">transaction{stats.transactionCount !== 1 ? "s" : ""} needed</div>
        </div>
        {saved > 0 && (
          <div className="bg-gold/10 text-gold rounded-2xl px-4 py-3 flex-1">
            <div className="font-display font-bold text-2xl">-{saved}</div>
            <div className="text-xs font-medium opacity-80">vs. settling debts one-by-one</div>
          </div>
        )}
      </div>

      {/* Receipt tape: the signature visual element */}
      <div className="bg-white rounded-t-lg shadow-card overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-dashed border-ink/15">
          <div className="font-display font-semibold text-sm tracking-wide text-ink/70">SETTLEMENT PLAN</div>
          <div className="text-[11px] text-ink/35 font-mono mt-0.5">minimum transactions to zero every balance</div>
        </div>

        <div className="divide-y divide-dashed divide-ink/10">
          {transactions.map((t, idx) => (
            <div key={idx} className="flex items-center gap-3 px-5 py-3.5">
              <Avatar name={t.fromName} id={t.from} size={28} />
              <span className="text-sm font-medium text-ink/80 w-20 truncate">{t.fromName}</span>
              <ArrowRight size={14} className="text-ink/25 shrink-0" />
              <span className="text-sm font-medium text-ink/80 w-20 truncate">{t.toName}</span>
              <Avatar name={t.toName} id={t.to} size={28} />
              <span className="ml-auto font-mono font-semibold text-settle-dim">{formatRupees(t.amount)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-3 bg-white receipt-edge-bottom" />
    </div>
  );
}
