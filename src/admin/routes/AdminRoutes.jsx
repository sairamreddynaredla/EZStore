import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageLoader from "../../components/common/PageLoader";
import { AdminAuthProvider } from "../context/AdminAuthContext";
import AdminProtectedRoute from "../components/AdminProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const ProductsPage = lazy(() => import("../pages/ProductsPage"));
const CategoriesPage = lazy(() => import("../pages/CategoriesPage"));
const OrdersPage = lazy(() => import("../pages/OrdersPage"));
const OrderDetailsPage = lazy(() => import("../pages/OrderDetailsPage"));
const CustomersPage = lazy(() => import("../pages/CustomersPage"));
const InventoryPage = lazy(() => import("../pages/InventoryPage"));
const CouponsPage = lazy(() => import("../pages/CouponsPage"));
const ReviewsPage = lazy(() => import("../pages/ReviewsPage"));
const UsersPage = lazy(() => import("../pages/UsersPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));

const AdminRoutes = () => (
  <AdminAuthProvider>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderDetailsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Suspense>
  </AdminAuthProvider>
);

export default AdminRoutes;
