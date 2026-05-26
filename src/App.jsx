import {
  BrowserRouter,
  Routes,
 Route,
} from "react-router-dom";

import Home from "./layouts/pages/Home";

import Login from "./layouts/pages/Login";

import Register from "./layouts/pages/Register";

import CategoryProducts from "./layouts/pages/CategoryProducts";

import ProductDetails from "./layouts/pages/ProductDetails";

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
const App = () => {

  return (

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

        {/* CATEGORY PRODUCTS */}
        <Route
          path="/category/:category"
          element={<CategoryProducts />}
        />

        {/* PRODUCT DETAILS */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
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

        {/* BREED CATEGORY PAGE */}
        <Route
          path="/breeds/:pet"
          element={<BreedCategory />}
        />

        {/* BREED DETAILS PAGE */}
        <Route
          path="/breed/:slug"
          element={<BreedDetails />}
        />

        {/* ORDER SUCCESS PAGE */}
        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />
         
        {/* CHECKOUT */}
<Route
  path="/checkout"
  element={<Checkout />}
/>

      </Routes>

    </BrowserRouter>

  );
};

export default App;