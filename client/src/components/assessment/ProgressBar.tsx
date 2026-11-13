export default function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current} className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`h-2 flex-1 rounded-full transition-colors duration-300 ${i < current ? "bg-primary" : "bg-line"}`} />
      ))}
    </div>
  );
}
