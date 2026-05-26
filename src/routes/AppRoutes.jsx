import { BrowserRouter, Routes, Route } from 'react-router-dom'

/* PAGES */
import Home from '../layouts/pages/Home'
import Login from '../layouts/pages/Login'
import Register from '../layouts/pages/Register'

import CategoryProducts from '../layouts/pages/CategoryProducts'

import ProductDetails from '../layouts/pages/ProductDetails'

import BreedDetails from '../layouts/pages/BreedDetails'
import BreedCategory from '../layouts/pages/BreedCategory'

import Shop from '../layouts/pages/Shop'
import BestSellers from '../layouts/pages/BestSellers'

import Blogs from '../layouts/pages/Blogs'
import BlogDetails from '../layouts/pages/BlogDetails'

import Cart from '../layouts/pages/Cart'
import WishList from '../layouts/pages/WishList'

import CheckOut from '../layouts/pages/CheckOut'
import OrderSuccess from '../layouts/pages/OrderSuccess'

/* NEW */
import Brands from '../layouts/pages/Brands'
import BrandProducts from '../layouts/pages/BrandProducts'

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME PAGE */}
        <Route
          path='/'
          element={<Home />}
        />

        {/* LOGIN PAGE */}
        <Route
          path='/login'
          element={<Login />}
        />

        {/* REGISTER PAGE */}
        <Route
          path='/register'
          element={<Register />}
        />

        {/* CATEGORY PRODUCTS PAGE */}
        <Route
          path='/category/:slug'
          element={<CategoryProducts />}
        />

        {/* ========================= */}
        {/* BRANDS NESTED ROUTES */}
        {/* ========================= */}


        <Route path='/brands' element={<Brands />} />
        <Route path='/brands/:brandSlug' element={<BrandProducts />} />

        {/* PRODUCT DETAILS PAGE */}
        <Route
          path='/product/:id'
          element={<ProductDetails />}
        />

        {/* BREED DETAILS PAGE */}
        <Route
          path='/breed/:slug'
          element={<BreedDetails />}
        />

        {/* BREED CATEGORY PAGE */}
        <Route
          path='/breed-category/:slug'
          element={<BreedCategory />}
        />

        {/* SHOP/PETS PAGE */}
        <Route
          path='/pets'
          element={<Shop />}
        />

        {/* BEST SELLERS PAGE */}
        <Route
          path='/best-sellers'
          element={<BestSellers />}
        />

        {/* BLOGS PAGE */}
        <Route
          path='/blogs'
          element={<Blogs />}
        />

        {/* BLOG DETAILS PAGE */}
        <Route
          path='/blog/:id'
          element={<BlogDetails />}
        />

        {/* CART PAGE */}
        <Route
          path='/cart'
          element={<Cart />}
        />

        {/* WISHLIST PAGE */}
        <Route
          path='/wishlist'
          element={<WishList />}
        />

        {/* CHECKOUT PAGE */}
        <Route
          path='/checkout'
          element={<CheckOut />}
        />

        {/* ORDER SUCCESS PAGE */}
        <Route
          path='/order-success'
          element={<OrderSuccess />}
        />

      </Routes>

    </BrowserRouter>
  )
}

export default AppRoutes