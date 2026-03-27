export default function DashboardLoading() {
  return (
    <div className="min-h-screen animate-pulse" style={{ background: '#FAFAF5' }}>
      <div className="h-48 bg-[#7B9EBD] rounded-b-3xl" />
      <div className="px-5 py-5 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-[#EBF4FF] rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
