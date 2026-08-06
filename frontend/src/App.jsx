import { useEffect, lazy, Suspense } from "react";
import PageLoader from "./components/common/PageLoader";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Lazy-load route pages to reduce initial bundle size
const Home = lazy(() => import("./layouts/pages/Home"));
const Login = lazy(() => import("./layouts/pages/Login"));
const Register = lazy(() => import("./layouts/pages/Register"));
const ProductDetails = lazy(() => import("./layouts/pages/ProductDetails"));
const DeliveryDetails = lazy(() => import("./layouts/pages/DeliveryDetails"));
const Cart = lazy(() => import("./layouts/pages/Cart"));
const BestSellers = lazy(() => import("./layouts/pages/BestSellers"));
const Shop = lazy(() => import("./layouts/pages/Shop"));
const BreedDetails = lazy(() => import("./layouts/pages/BreedDetails"));
const BreedCategory = lazy(() => import("./layouts/pages/BreedCategory"));
const OrderSuccess = lazy(() => import("./layouts/pages/OrderSuccess"));
const WishList = lazy(() => import("./layouts/pages/WishList"));
const Checkout = lazy(() => import("./layouts/pages/CheckOut"));
const BrandProducts = lazy(() => import("./layouts/pages/BrandProducts"));
const BrandCollectionPage = lazy(() => import("./layouts/pages/BrandCollectionPage"));
const CategoryProducts = lazy(() => import("./layouts/pages/CategoryProducts"));
const Brands = lazy(() => import("./layouts/pages/Brands"));
const ForgotPassword = lazy(() => import("./layouts/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./layouts/pages/ResetPassword"));
const GoogleAuthCallback = lazy(() => import("./layouts/pages/GoogleAuthCallback"));
const Account = lazy(() => import("./layouts/pages/Account"));
const ChangePassword = lazy(() => import("./layouts/pages/ChangePassword"));
const Orders = lazy(() => import("./layouts/pages/Orders"));
const Addresses = lazy(() => import("./layouts/pages/Addresses"));
const PaymentSuccess = lazy(() => import("./layouts/pages/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./layouts/pages/PaymentFailed"));
const PaymentHistory = lazy(() => import("./layouts/pages/PaymentHistory"));
const InvoiceReceipt = lazy(() => import("./layouts/pages/InvoiceReceipt"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

import { ToastProvider } from "./context/toast-context";
import Toast from "./components/common/Toast";
import CartProvider from "./context/CartProvider";

const AdminRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const configuredAdminUrl = import.meta.env.VITE_ADMIN_APP_URL;
    const adminOrigin = configuredAdminUrl || (
      window.location.hostname === "localhost"
        ? "http://localhost:5174"
        : "https://admin-sairamreddynaredlas-projects.vercel.app"
    );

    const destination = new URL(adminOrigin);
    destination.pathname = location.pathname;
    destination.search = location.search;
    destination.hash = location.hash;
    window.location.replace(destination.toString());
  }, [location]);

  return <PageLoader />;
};

const App = () => {
  useEffect(() => {
    // Error handler removed - using component-level error handling instead
  }, []);

  return (
    <ToastProvider>
      <CartProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* HOME */}

              <Route path="/" element={<Home />} />

              {/* LOGIN */}

              <Route path="/login" element={<Login />} />

              {/* REGISTER */}

              <Route path="/register" element={<Register />} />

              {/* CATEGORY PAGE */}

              <Route path="/category/:category" element={<CategoryProducts />} />

              {/* DOG CATEGORY PAGE */}
              <Route path="/dogs/:categorySlug" element={<CategoryProducts petType="Dog" />} />

              {/* CAT CATEGORY PAGE */}
              <Route path="/cats/:categorySlug" element={<CategoryProducts petType="Cat" />} />

              {/* PRODUCT DETAILS */}

              <Route path="/product/:id" element={<ProductDetails />} />

              {/* DELIVERY DETAILS PLACEHOLDER */}
              <Route path="/delivery-details" element={<DeliveryDetails />} />

              {/* CART */}

              <Route path="/cart" element={<Cart />} />

              {/* WISHLIST */}

              <Route path="/wishlist" element={<WishList />} />

              {/* SHOP */}

              <Route path="/shop" element={<Shop />} />

              {/* CUSTOMER AUTH */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
              <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
              <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />

              {/* PETS */}

              {/* PETS */}

              <Route path="/pets" element={<Shop />} />

              {/* BRANDS */}
              <Route path="/brands" element={<Brands />} />

              {/* BRAND PRODUCTS */}

              <Route path="/brands/:brandSlug" element={<BrandCollectionPage />} />

              {/* BEST SELLERS */}

              <Route path="/best-sellers" element={<BestSellers />} />

              {/* BLOGS removed */}

              {/* BREED CATEGORY route removed — categories handled on Home */}

              {/* BREED DETAILS */}

              <Route path="/breed/:slug" element={<BreedDetails />} />

              {/* ORDER SUCCESS */}

              <Route path="/order-success" element={<OrderSuccess />} />

              {/* CHECKOUT & PAYMENTS */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Navigate to="/checkout" replace />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failed" element={<PaymentFailed />} />
              <Route path="/payment/history" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
              <Route path="/payment/invoice/:orderId" element={<ProtectedRoute><InvoiceReceipt /></ProtectedRoute>} />

              {/* ADMIN: hosted as a separate application */}
              <Route path="/admin/*" element={<AdminRedirect />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toast />
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
