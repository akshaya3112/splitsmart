import { formatRupees } from "../utils/format";
import Avatar from "./Avatar";

export default function BalancesView({ members, netBalances }) {
  const sorted = [...members].sort((a, b) => (netBalances[b.id] || 0) - (netBalances[a.id] || 0));

  return (
    <div className="space-y-3 animate-slide-up">
      {sorted.map((m) => {
        const bal = netBalances[m.id] || 0;
        const isPositive = bal > 0;
        const isZero = bal === 0;
        return (
          <div
            key={m.id}
            className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border border-ink/5 shadow-[0_2px_8px_rgba(20,21,27,0.02)] hover:shadow-[0_8px_20px_-6px_rgba(20,21,27,0.06)] hover:border-ink/10 transition-all duration-200"
          >
            <Avatar name={m.name} id={m.id} size={38} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink leading-snug">{m.name}</div>
              <div className="mt-1">
                {isZero ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-ink/5 text-ink/40 uppercase tracking-wider">
                    Settled Up
                  </span>
                ) : isPositive ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-settle/10 text-settle-dim uppercase tracking-wider">
                    Gets Back
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-owe/10 text-owe-dim uppercase tracking-wider">
                    Owes
                  </span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div
                className={`font-mono font-bold text-base ${
                  isZero ? "text-ink/20" : isPositive ? "text-settle-dim" : "text-owe-dim"
                }`}
              >
                {isZero ? "—" : formatRupees(Math.abs(bal))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
