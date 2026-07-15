import React, { useState } from "react";

const ReviewItem = ({ r }) => (
  <div className="border-b last:border-b-0 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-yellow-500 font-bold">{r.rating}★</div>
        <div>
          <div className="font-semibold">{r.title}</div>
          <div className="text-xs text-slate-500">
            by {r.author} • {r.date}
          </div>
        </div>
      </div>
      <div className="text-sm text-slate-500">Helpful: {r.helpful}</div>
    </div>
    <p className="mt-3 text-slate-700">{r.body}</p>
  </div>
);

const ReviewList = ({ reviews = [], pageSize = 5 }) => {
  const [page, setPage] = useState(1);
  const total = reviews.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const start = (page - 1) * pageSize;
  const visible = reviews.slice(start, start + pageSize);

  return (
    <div>
      <h3 className="heading-h2 mb-4">Customer reviews</h3>

      <div className="space-y-4">
        {visible.map((r) => (
          <ReviewItem key={r.id} r={r} />
        ))}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-slate-600">
          Showing {start + 1}–{Math.min(start + pageSize, total)} of {total} reviews
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded border border-gray-300 text-slate-700 hover:bg-gray-50"
          >
            Prev
          </button>
          <div className="px-3">
            {page} / {totalPages}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 rounded border border-gray-300 text-slate-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
