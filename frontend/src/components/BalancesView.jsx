import { formatRupees } from "../utils/format";
import Avatar from "./Avatar";

export default function BalancesView({ members, netBalances }) {
  const sorted = [...members].sort((a, b) => (netBalances[b.id] || 0) - (netBalances[a.id] || 0));

  return (
    <div className="space-y-2 animate-slide-up">
      {sorted.map((m) => {
        const bal = netBalances[m.id] || 0;
        const isPositive = bal > 0;
        const isZero = bal === 0;
        return (
          <div key={m.id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-card">
            <Avatar name={m.name} id={m.id} size={34} />
            <div className="flex-1">
              <div className="text-sm font-medium text-ink">{m.name}</div>
              <div className="text-xs text-ink/40">
                {isZero ? "settled up" : isPositive ? "gets back" : "owes"}
              </div>
            </div>
            <div
              className={`font-mono font-semibold ${
                isZero ? "text-ink/30" : isPositive ? "text-settle-dim" : "text-owe-dim"
              }`}
            >
              {isZero ? "—" : formatRupees(Math.abs(bal))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
