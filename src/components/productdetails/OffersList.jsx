import React from 'react'

const OffersList = ({ offers = [] }) => {
  if (!offers || offers.length === 0) return null

  return (
    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-sm text-slate-800">
      <h4 className="font-semibold mb-2">Special offers and product promotions</h4>
      <ul className="list-disc pl-5 space-y-1">
        {offers.map((o, i) => (
          <li key={i}>{o}</li>
        ))}
      </ul>
    </div>
  )
}

export default OffersList
