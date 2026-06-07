import React from 'react'

const ReviewSummary = ({ rating = 0, reviews = 0, breakdown }) => {
  // breakdown: {5: n,4: n,3: n,2: n,1: n}
  const total = breakdown ? Object.values(breakdown).reduce((a, b) => a + b, 0) : reviews || 0

  const pct = (count) => (total === 0 ? 0 : Math.round((count / total) * 100))

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-3">
        <div className="text-3xl font-bold text-yellow-500">{rating}</div>
        <div>
          <div className="text-sm text-slate-600">Average rating</div>
          <div className="text-sm text-slate-600">{reviews} ratings</div>
        </div>
      </div>

      <div className="mt-3 space-y-2 text-sm text-slate-600">
        {[5,4,3,2,1].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className="w-8 text-right">{s}★</div>
            <div className="flex-1 h-2 bg-slate-200 rounded overflow-hidden">
              <div className="h-2 bg-yellow-400" style={{width: `${pct(breakdown?.[s] || 0)}%`}} />
            </div>
            <div className="w-10 text-right">{pct(breakdown?.[s] || 0)}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewSummary
