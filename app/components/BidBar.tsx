export function BidBar({ value }: { value: number }) {
  const n = Math.min(value * 4, 100)

  return (
    <div className="relative">
      <div
        className="absolute inset-y-1 left-1 rounded-md bg-emerald-500/10"
        style={{ width: `${n}%` }}
      />
      <span className="relative z-10 text-emerald-400">{value}</span>
    </div>
  )
}