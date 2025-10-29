export default function Logo() {
  return (
    <div className="flex items-center gap-1.5">
      <img src="/favicon.svg" alt="Ribbon" width={24} height={24} className="min-w-6" />
      <span className="font-bold hidden sm:inline">Ribbon</span>
    </div>
  )
}
