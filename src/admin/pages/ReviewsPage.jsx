import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../../context/toast-context";
import { deleteReview, getReviews, updateReviewStatus } from "../services/reviewService";
import Badge from "../components/Badge";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import FilterGroup from "../components/FilterGroup";
import Pagination from "../components/Pagination";
import TableShell from "../components/TableShell";

const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_TONES = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

const STATUS_FILTERS = [
  { value: "", label: "All reviews" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [actionLoading, setActionLoading] = useState({});
  const { success, error: toastError } = useToast();

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      q: search || undefined,
      status: statusFilter || undefined,
    }),
    [currentPage, pageSize, search, statusFilter]
  );

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getReviews(queryParams);
      setReviews(result.items);
      setTotalItems(result.total);
      setCurrentPage(result.page);
      setPageSize(result.pageSize);
    } catch {
      setError("Unable to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleStatusChange = async (reviewId, status) => {
    setActionLoading((current) => ({ ...current, [reviewId]: true }));
    try {
      await updateReviewStatus(reviewId, status);
      success(`Review ${status === "approved" ? "approved" : "rejected"} successfully.`);
      await loadReviews();
    } catch {
      toastError("Unable to update review status. Please try again.");
    } finally {
      setActionLoading((current) => ({ ...current, [reviewId]: false }));
    }
  };

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm("Delete this review? This action cannot be undone.");
    if (!confirmed) return;

    setActionLoading((current) => ({ ...current, [reviewId]: true }));
    try {
      await deleteReview(reviewId);
      success("Review deleted successfully.");
      await loadReviews();
    } catch {
      toastError("Unable to delete review. Please try again.");
    } finally {
      setActionLoading((current) => ({ ...current, [reviewId]: false }));
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        description="Moderate customer reviews, approve feedback, and remove inappropriate content."
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.5fr_auto]">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search by reviewer, product, or comment"
          label="Search reviews"
        />

        <FilterGroup label="Review status">
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FilterGroup>
      </div>
    </section>

      {error && <div className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <TableShell
        loading={loading}
        columns={["Reviewer", "Product", "Rating", "Comment", "Status", "Date", "Actions"]}
        emptyMessage="No reviews found."
      >
        {reviews.map((review) => {
          const productName = review.product?.title || review.product?.name || review.productName || "Unknown product";
          const reviewerName = review.reviewer || review.author || review.name || "Anonymous";
          const reviewDate = review.createdAt || review.date || review.reviewedAt;
          const formattedDate = reviewDate ? new Date(reviewDate).toLocaleDateString() : "—";
          const currentStatus = review.status || "pending";
          const isActionLoading = Boolean(actionLoading[review.id]);

          return (
            <tr key={review.id} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="max-w-48 truncate px-5 py-3 align-top font-semibold text-slate-900">{reviewerName}</td>
              <td className="max-w-56 truncate px-5 py-3 align-top text-slate-700">{productName}</td>
              <td className="whitespace-nowrap px-5 py-3 align-top text-slate-700">{review.rating ?? review.stars ?? "—"}★</td>
              <td className="max-w-96 truncate px-5 py-3 align-top text-slate-700 line-clamp-2">{review.comment || review.body || review.text || "—"}</td>
              <td className="whitespace-nowrap px-5 py-3 align-top">
                <Badge label={STATUS_LABELS[currentStatus]} tone={STATUS_TONES[currentStatus] || "neutral"} />
              </td>
              <td className="px-5 py-4 align-top text-slate-700">{formattedDate}</td>
              <td className="max-w-48 px-5 py-3 align-top">
                <div className="flex flex-wrap gap-2">
                  {currentStatus !== "approved" && (
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => handleStatusChange(review.id, "approved")}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Approve
                    </button>
                  )}
                  {currentStatus !== "rejected" && (
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => handleStatusChange(review.id, "rejected")}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-rose-500 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={isActionLoading}
                    onClick={() => handleDelete(review.id)}
                    className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </TableShell>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default ReviewsPage;
