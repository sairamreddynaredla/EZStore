import { Children } from "react";

const TableShell = ({ children, emptyMessage, loading, columns }) => {
  const hasRows = !loading && Children.count(children) > 0;

  return (
    <div className="overflow-x-auto rounded-3xl border border-neutral-border bg-white shadow-sm">
      <table className="min-w-full table-fixed divide-y divide-slate-100 text-left text-sm" aria-busy={loading}>
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            {columns.map((column) => (
              <th key={column} className="truncate px-5 py-4 font-medium text-slate-600">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-slate-500">
                Loading...
              </td>
            </tr>
          ) : hasRows ? (
            children
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableShell;
