import { sendSuccess, setCorsHeaders } from "../_shared.js";

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  sendSuccess(res, { totalOrders: 0, totalRevenue: 0, totalCustomers: 0, pendingOrders: 0, lowStockProducts: 0, recentOrders: [] });
}
