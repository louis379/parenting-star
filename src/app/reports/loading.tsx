export default function ReportsLoading() {
  return (
    <div className="min-h-screen animate-pulse" style={{ background: '#fffbf5' }}>
      <div className="h-40 bg-orange-400 rounded-b-3xl" />
      <div className="px-5 py-5 space-y-4">
        <div className="h-32 bg-orange-100 rounded-2xl" />
        <div className="h-48 bg-orange-100 rounded-2xl" />
        <div className="h-24 bg-orange-100 rounded-2xl" />
      </div>
    </div>
  )
}
