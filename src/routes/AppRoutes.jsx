import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import CategoryProducts from '../pages/CategoryProducts'
import ProductDetails from '../pages/ProductDetails'
import BreedDetails from '../layouts/pages/BreedDetails';

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

      </Routes>

    </BrowserRouter>
  )
}

export default AppRoutes