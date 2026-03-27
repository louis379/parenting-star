export default function MealsLoading() {
  return (
    <div className="min-h-screen animate-pulse" style={{ background: '#FAFAF5' }}>
      <div className="h-40 bg-[#7B9EBD] rounded-b-3xl" />
      <div className="px-5 py-5 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-[#EBF4FF] rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
