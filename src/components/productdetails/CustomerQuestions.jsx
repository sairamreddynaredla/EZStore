import React, { useState } from 'react'

const Question = ({ q }) => (
  <div className="border-b last:border-b-0 py-3">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold">Q: {q.question}</div>
        <div className="text-xs text-slate-500">asked by {q.askedBy} • {q.date}</div>
      </div>
    </div>
    <div className="mt-2 space-y-2">
      {q.answers?.map((a) => (
        <div key={a.id} className="bg-slate-50 p-3 rounded">
          <div className="text-sm">{a.text}</div>
          <div className="text-xs text-slate-500 mt-1">— {a.author}, {a.date}</div>
        </div>
      ))}
    </div>
  </div>
)

const CustomerQuestions = ({ questions = [] }) => {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="mt-6">
      <h3 className="heading-h2 mb-3">Customer Questions & Answers</h3>

      <div className="space-y-3">
        {questions.map((q) => (
          <Question key={q.id} q={q} />
        ))}
      </div>

      <div className="mt-4">
        <button onClick={() => setShowForm((s) => !s)} className="px-4 py-2 rounded border border-gray-300 text-slate-700 hover:bg-gray-50">Ask a question</button>

        {showForm && (
          <form className="mt-3 space-y-2">
            <input placeholder="Your name" className="w-full border rounded px-3 py-2" />
            <textarea placeholder="Your question" className="w-full border rounded px-3 py-2" rows={3} />
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded">Submit</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded border border-gray-300 text-slate-700 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default CustomerQuestions
