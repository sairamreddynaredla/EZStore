import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import customerCommerceApi from "../../services/customerCommerceApi";
import { Printer, Download, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

const InvoiceReceipt = () => {
  const { orderId } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    customerCommerceApi
      .getPaymentByOrder(orderId)
      .then((res) => {
        const p = res.data?.data?.payment || res.data?.payment;
        setPayment(p);
      })
      .catch((err) => {
        console.error("Failed to fetch invoice data:", err);
        setError("Invoice not found or access denied.");
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <Navbar />
        <div className="max-w-md mx-auto py-20 text-center px-4">
          <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 font-medium mb-4">{error}</div>
          <Link to="/orders" className="text-orange-600 font-bold hover:underline">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const order = payment.order || {};
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors print:bg-white print:text-black">
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Action Header */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Link to="/payment/history" className="text-sm font-semibold flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-orange-600">
            <ArrowLeft className="w-4 h-4" /> Back to Payment History
          </Link>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>

        {/* Invoice Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-8 mb-8">
            <div>
              <span className="text-2xl font-black tracking-tight text-orange-600">EZStore</span>
              <p className="text-xs text-slate-400 mt-1">Official Tax Invoice & Payment Receipt</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold uppercase tracking-wider text-slate-400">INVOICE</h2>
              <p className="font-mono text-sm font-bold mt-1">#{payment.paymentNumber || `PAY-${payment.id}`}</p>
              <p className="text-xs text-slate-400">{new Date(payment.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Billing & Order info */}
          <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div>
              <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Billed To</span>
              <p className="font-bold">{order.shippingAddress?.recipientName || "Customer"}</p>
              <p className="text-slate-500">{order.shippingAddress?.street}</p>
              <p className="text-slate-500">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
              <p className="text-slate-500">{order.shippingAddress?.phone}</p>
            </div>
            <div className="text-right">
              <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Order Details</span>
              <p className="font-mono font-bold text-orange-600">{order.orderNumber}</p>
              <p className="text-slate-500 capitalize">Method: {payment.provider || payment.method}</p>
              <p className="text-slate-500 uppercase font-semibold text-emerald-600">Status: {payment.status}</p>
              {payment.transactionId && (
                <p className="text-xs font-mono text-slate-400 mt-1">Txn ID: {payment.transactionId}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-collapse text-sm mb-8">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-xs">
                <th className="py-3">Item</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Price</th>
                <th className="py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((it, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-medium">{it.productName || it.title || "Product"}</td>
                  <td className="py-3 text-center">{it.quantity || 1}</td>
                  <td className="py-3 text-right">${(it.unitPrice || it.price || 0).toFixed(2)}</td>
                  <td className="py-3 text-right font-semibold">${((it.unitPrice || it.price || 0) * (it.quantity || 1)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end border-t border-slate-200 dark:border-slate-800 pt-6 mb-8">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${(order.totalAmount || payment.amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax & Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-extrabold text-base border-t border-slate-200 dark:border-slate-800 pt-2 text-slate-900 dark:text-white">
                <span>Amount Paid</span>
                <span className="text-orange-600">${(payment.amount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>This is a computer-generated invoice and requires no physical signature.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceReceipt;
