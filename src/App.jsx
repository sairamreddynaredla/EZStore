import { useEffect, lazy, Suspense } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Lazy-load route pages to reduce initial bundle size
const Home = lazy(() => import('./layouts/pages/Home'))
const Login = lazy(() => import('./layouts/pages/Login'))
const Register = lazy(() => import('./layouts/pages/Register'))
const ProductDetails = lazy(() => import('./layouts/pages/ProductDetails'))
const DeliveryDetails = lazy(() => import('./layouts/pages/DeliveryDetails'))
const Cart = lazy(() => import('./layouts/pages/Cart'))
const BestSellers = lazy(() => import('./layouts/pages/BestSellers'))
const Shop = lazy(() => import('./layouts/pages/Shop'))
const BreedDetails = lazy(() => import('./layouts/pages/BreedDetails'))
const BreedCategory = lazy(() => import('./layouts/pages/BreedCategory'))
const OrderSuccess = lazy(() => import('./layouts/pages/OrderSuccess'))
const WishList = lazy(() => import('./layouts/pages/WishList'))
const Checkout = lazy(() => import('./layouts/pages/CheckOut'))
const BrandProducts = lazy(() => import('./layouts/pages/BrandProducts'))
const CategoryProducts = lazy(() => import('./layouts/pages/CategoryProducts'))
const Brands = lazy(() => import('./layouts/pages/Brands'))

// ✅ UPDATED IMPORT
import CartProvider from "./context/CartProvider";

const App = () => {

  useEffect(() => {
    const handler = (e) => {
      const t = e.target
      if (t && t.tagName === 'IMG') {
        const src = t.src || ''
        const placeholder = '/assets/placeholder-product.svg'
        if (src && !src.includes(placeholder)) {
          t.onerror = null
          t.src = placeholder
        }
      }
    }

    window.addEventListener('error', handler, true)
    return () => window.removeEventListener('error', handler, true)
  }, [])


  return (

    <CartProvider>

      <BrowserRouter>

        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>

          <Routes>

          {/* HOME */}

          <Route
            path="/"
            element={<Home />}
          />

          {/* LOGIN */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* REGISTER */}

          <Route
            path="/register"
            element={<Register />}
          />

          {/* CATEGORY PAGE */}

          <Route
            path="/category/:category"
            element={<CategoryProducts />}
          />

          {/* DOG CATEGORY PAGE */}
          <Route
            path="/dogs/:categorySlug"
            element={<CategoryProducts petType="Dog" />}
          />

          {/* CAT CATEGORY PAGE */}
          <Route
            path="/cats/:categorySlug"
            element={<CategoryProducts petType="Cat" />}
          />

          {/* PRODUCT DETAILS */}

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          {/* DELIVERY DETAILS PLACEHOLDER */}
          <Route
            path="/delivery-details"
            element={<DeliveryDetails />}
          />

          {/* CART */}

          <Route
            path="/cart"
            element={<Cart />}
          />

          {/* WISHLIST */}

          <Route
            path="/wishlist"
            element={<WishList />}
          />

          {/* SHOP */}

          <Route
            path="/shop"
            element={<Shop />}
          />

          {/* PETS */}

          <Route
            path="/pets"
            element={<Shop />}
          />

          {/* BRANDS */}
          <Route
            path="/brands"
            element={<Brands />}
          />

          {/* BRAND PRODUCTS */}

          <Route
            path="/brands/:brandSlug"
            element={<BrandProducts />}
          />

          {/* BEST SELLERS */}

          <Route
            path="/best-sellers"
            element={<BestSellers />}
          />

          {/* BLOGS removed */}

          {/* BREED CATEGORY */}

          <Route
            path="/breeds/:pet"
            element={<BreedCategory />}
          />

          {/* BREED DETAILS */}

          <Route
            path="/breed/:slug"
            element={<BreedDetails />}
          />

          {/* ORDER SUCCESS */}

          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

          {/* CHECKOUT */}

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>

        </Suspense>

      </BrowserRouter>

    </CartProvider>

  );
};

export default App;