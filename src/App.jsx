import { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./layouts/pages/Home";
import Login from "./layouts/pages/Login";
import Register from "./layouts/pages/Register";
import ProductDetails from "./layouts/pages/ProductDetails";
import DeliveryDetails from "./layouts/pages/DeliveryDetails";
import Cart from "./layouts/pages/Cart";
import BestSellers from "./layouts/pages/BestSellers";
import Shop from "./layouts/pages/Shop";
import Brands from "./layouts/pages/Brands";
import Blogs from "./layouts/pages/Blogs";
import BlogDetails from "./layouts/pages/BlogDetails";
import BreedDetails from "./layouts/pages/BreedDetails";
import BreedCategory from "./layouts/pages/BreedCategory";
import OrderSuccess from "./layouts/pages/OrderSuccess";
import WishList from "./layouts/pages/WishList";
import Checkout from "./layouts/pages/CheckOut";
import BrandProducts from "./layouts/pages/BrandProducts";
import CategoryProducts from "./layouts/pages/CategoryProducts";

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

          {/* BLOGS */}

          <Route
            path="/blogs"
            element={<Blogs />}
          />

          {/* BLOG DETAILS */}

          <Route
            path="/blogs/:slug"
            element={<BlogDetails />}
          />

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

      </BrowserRouter>

    </CartProvider>

  );
};

export default App;