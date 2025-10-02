export function MapMock() {
  return (
    <div className="rounded-2xl border p-4 w-72 bg-white dark:bg-black">
      <div className="h-40 w-full rounded-lg bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 relative overflow-hidden">
        <div className="absolute left-6 top-8 h-3 w-3 rounded-full bg-black dark:bg-white"></div>
        <div className="absolute left-20 top-16 h-3 w-3 rounded-full bg-black dark:bg-white"></div>
        <div className="absolute left-40 top-24 h-3 w-3 rounded-full bg-black dark:bg-white"></div>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(#000 1px,transparent 1px)', backgroundSize:'10px 10px'}}/>
      </div>
      <div className="mt-3 text-sm text-text-dim">Pin places you’ve saved. See them on a map.</div>
    </div>
  )
}
