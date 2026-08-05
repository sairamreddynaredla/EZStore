import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { CheckCircle2, FileText, ArrowLeft, PackageCheck } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderNumber = searchParams.get("orderNumber") || "N/A";
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Payment Successful!</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            Thank you for your order. Your payment has been authorized and confirmed successfully.
          </p>

          <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 mb-8 border border-slate-100 dark:border-slate-800 flex justify-around text-sm">
            <div>
              <span className="block text-xs uppercase font-semibold text-slate-400">Order Number</span>
              <span className="font-mono font-bold text-base text-orange-600">{orderNumber}</span>
            </div>
            <div>
              <span className="block text-xs uppercase font-semibold text-slate-400">Status</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <PackageCheck className="w-4 h-4" /> Paid & Confirmed
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            {orderId && (
              <Link
                to={`/payment/invoice/${orderId}`}
                className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <FileText className="w-4 h-4" /> View Invoice / Receipt
              </Link>
            )}
            <Link
              to="/orders"
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all"
            >
              My Orders
            </Link>
            <Link
              to="/"
              className="px-6 py-3 rounded-xl border border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
