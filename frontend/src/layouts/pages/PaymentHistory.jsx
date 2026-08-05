import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import customerCommerceApi from "../../services/customerCommerceApi";
import { CreditCard, FileText, CheckCircle2, Clock, XCircle, RotateCcw, Loader2 } from "lucide-react";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    customerCommerceApi
      .getPaymentsForCustomer()
      .then((res) => {
        const list = res.data?.data?.payments || res.data?.payments || [];
        setPayments(list);
      })
      .catch((err) => {
        console.error("Failed to fetch payment history:", err);
        setError("Failed to load payment history.");
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "paid":
      case "success":
      case "succeeded":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
            <RotateCcw className="w-3.5 h-3.5" /> Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
            <XCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Payment & Transaction History</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review all your payment transactions and download invoices.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 text-center font-medium">{error}</div>
        ) : payments.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-700">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold">No Payments Found</h3>
            <p className="text-slate-500 text-sm mt-1 mb-6">You haven't made any payment transactions yet.</p>
            <Link to="/shop" className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 font-semibold uppercase text-xs">
                    <th className="p-4">Payment ID / Date</th>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Provider</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 font-mono font-medium">
                        <div>{p.paymentNumber || `PAY-${p.id}`}</div>
                        <div className="text-xs text-slate-400 font-sans">{new Date(p.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4 font-semibold text-orange-600">{p.order?.orderNumber || `ORD-${p.orderId}`}</td>
                      <td className="p-4 capitalize font-medium">{p.provider || p.method}</td>
                      <td className="p-4 font-bold">${(p.amount || 0).toFixed(2)}</td>
                      <td className="p-4">{getStatusBadge(p.status)}</td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/payment/invoice/${p.orderId}`}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium text-xs"
                        >
                          <FileText className="w-4 h-4" /> View Invoice
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
