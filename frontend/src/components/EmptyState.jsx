export default function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-slide-up">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-ink/5 flex items-center justify-center mb-4">
          <Icon size={24} strokeWidth={1.75} className="text-ink/40" />
        </div>
      )}
      <h3 className="font-display font-semibold text-lg text-ink">{title}</h3>
      {subtitle && <p className="text-ink/50 text-sm mt-1.5 max-w-xs">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
