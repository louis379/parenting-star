export default function DashboardLoading() {
  return (
    <div className="min-h-screen animate-pulse" style={{ background: '#fffbf5' }}>
      <div className="h-48 bg-orange-400 rounded-b-3xl" />
      <div className="px-5 py-5 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-orange-100 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
