export function AskBar({ value }: { value: number }) {
  const n = Math.min(value * 4, 100)

  return (
    <div className="relative">
      <div
        className="absolute inset-y-1 right-1 rounded-md bg-rose-500/10"
        style={{ width: `${n}%` }}
      />
      <span className="relative z-10 text-rose-400">{value}</span>
    </div>
  )
}