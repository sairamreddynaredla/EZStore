import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { XCircle, RefreshCw, HelpCircle } from "lucide-react";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason") || "Your payment could not be completed.";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-6">
            <XCircle className="w-12 h-12" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Payment Failed</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            We were unable to process your payment. Don't worry, your card or bank account was not charged.
          </p>

          <div className="w-full bg-red-50 dark:bg-red-950/40 rounded-2xl p-4 mb-8 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 font-medium">
            Reason: {reason}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link
              to="/payment"
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </Link>
            <Link
              to="/cart"
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm flex items-center justify-center gap-2"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
