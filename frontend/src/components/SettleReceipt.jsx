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
    <div className="animate-slide-up space-y-6">
      {/* Smart notification helper */}
      <div className="flex items-center justify-between bg-gradient-to-r from-settle/10 to-[#10e2a3]/5 border border-settle/15 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,179,126,0.04)]">
        <div className="space-y-0.5">
          <div className="text-[11px] font-bold text-settle-dim uppercase tracking-wider">Settlement Strategy</div>
          <div className="text-xs text-ink/70">
            Settle all balances offline in only <strong className="text-settle-dim font-bold">{stats.transactionCount} payment{stats.transactionCount !== 1 ? "s" : ""}</strong>.
          </div>
        </div>
        {saved > 0 && (
          <div className="shrink-0 bg-gold/15 text-ink/70 border border-gold/20 rounded-xl px-2.5 py-1.5 text-[10px] font-bold font-display flex items-center gap-1">
            ✨ {saved} payment{saved > 1 ? "s" : ""} saved!
          </div>
        )}
      </div>

      {/* Perforated receipt edge card */}
      <div className="bg-white rounded-t-2xl shadow-[0_4px_25px_-5px_rgba(20,21,27,0.04)] border border-ink/5 overflow-hidden">
        <div className="px-6 py-5 border-b border-dashed border-ink/10 bg-paper/10">
          <div className="font-display font-bold text-xs tracking-wider text-ink/40 uppercase">SETTLEMENT PLAN</div>
          <div className="text-[11px] text-ink/35 font-mono mt-0.5">minimum transactions to zero every balance</div>
        </div>

        <div className="divide-y divide-dashed divide-ink/10">
          {transactions.map((t, idx) => (
            <div key={idx} className="flex items-center gap-4 px-6 py-4 hover:bg-paper/10 transition-colors duration-150">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <Avatar name={t.fromName} id={t.from} size={28} />
                <span className="text-sm font-semibold text-ink truncate">{t.fromName}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center shrink-0 text-ink/20">
                <span className="text-[9px] font-bold text-ink/30 uppercase tracking-widest leading-none">pays</span>
                <ArrowRight size={14} className="mt-0.5 text-settle" />
              </div>
              
              <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
                <span className="text-sm font-semibold text-ink truncate text-right">{t.toName}</span>
                <Avatar name={t.toName} id={t.to} size={28} />
              </div>
              
              <div className="pl-4 border-l border-ink/5 text-right shrink-0">
                <div className="text-[9px] font-semibold text-ink/30 uppercase tracking-wider">Amount</div>
                <div className="font-mono font-bold text-settle-dim text-base mt-0.5">{formatRupees(t.amount)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-3 bg-white receipt-edge-bottom -mt-6 shadow-[0_8px_20px_-8px_rgba(20,21,27,0.06)] rounded-b-2xl" />
    </div>
  );
}
