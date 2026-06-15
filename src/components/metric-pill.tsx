export function MetricPill({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "good" | "warn" }) {
  const tones = {
    neutral: "bg-slate-100 text-ink",
    good: "bg-teal-50 text-teal-800",
    warn: "bg-orange-50 text-orange-800"
  };

  return (
    <div className={`rounded-2xl px-3 py-2 ${tones[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}
