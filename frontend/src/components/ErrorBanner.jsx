import { AlertTriangle, X } from "lucide-react";

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 bg-owe-bg border border-owe/20 text-owe-dim rounded-xl px-4 py-3 animate-slide-up">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <p className="text-sm flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-owe-dim/60 hover:text-owe-dim">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
