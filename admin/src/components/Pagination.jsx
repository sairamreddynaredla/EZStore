const Pagination = ({ page, totalPages, onPageChange, pageSize, onPageSizeChange, pageSizeOptions = [10, 20, 50] }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span>Page {page} of {totalPages}</span>
        <span className="h-4 w-px bg-slate-200" />
        <label className="flex items-center gap-2">
          Show
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-2xl border border-neutral-border bg-slate-50 px-3 py-2 focus:border-primary-500 focus:outline-none"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          per page
        </label>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="rounded-2xl border border-neutral-border bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="rounded-2xl border border-neutral-border bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
