export default function GrowthLoading() {
  return (
    <div className="min-h-screen animate-pulse" style={{ background: '#fffbf5' }}>
      <div className="h-40 bg-orange-400 rounded-b-3xl" />
      <div className="px-5 py-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-orange-100 rounded-2xl" />
          ))}
        </div>
        <div className="h-56 bg-orange-100 rounded-2xl" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 bg-orange-100 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
