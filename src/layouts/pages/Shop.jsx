import { useState } from 'react'

import {
  useLocation,
} from 'react-router-dom'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

import ProductFilters from '../../components/products/ProductFilters'
import ProductGrid from '../../components/products/ProductGrid'
import ProductSort from '../../components/products/ProductSort'
import ProductSearch from '../../components/products/ProductSearch'

import { products } from '../../data/products'
import useCart from '../../hooks/usecart'
import { useWishlist } from '../../context/WishListContext'

const Shop = () => {

  const location = useLocation()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, wishlist: wishlistItems } = useWishlist()

  // WISHLIST TOGGLE HANDLER
  const handleWishlistToggle = (product, isAdding) => {
    if (isAdding) {
      addToWishlist(product)
    } else {
      removeFromWishlist(product.id)
    }
  }

  // ADD TO CART HANDLER
  const handleAddToCart = async (product, quantity) => {
    if (product) {
      addToCart({ ...product, quantity })
    }
  }

  // URL PARAMS
  const queryParams =
    new URLSearchParams(location.search)

  const petParam =
    queryParams.get('pet')

  const searchParam =
    queryParams.get('search')

  const saleParam =
    queryParams.get('sale')

  // SEARCH
  const [search, setSearch] =
    useState(() => searchParam || '')

  // SORT
  const [sort, setSort] =
    useState('featured')

  // FILTER STATES
  const [selectedPet, setSelectedPet] =
    useState(() =>

      petParam
        ? petParam.charAt(0).toUpperCase() +
            petParam.slice(1)
        : 'all'
    )

  const [selectedCategory, setSelectedCategory] =
    useState('all')

  // FILTER PRODUCTS
  let filtered = products.filter((product) => {

    const matchesSearch =

      product.name
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      product.brand
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      product.category
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      product.pet
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchesPet =

      selectedPet === 'all'
        ? true
        : product.pet === selectedPet

    const matchesCategory =

      selectedCategory === 'all'
        ? true
        : product.subCategory ===
          selectedCategory

    // SALE FILTER
    const matchesSale =

      saleParam === 'true'
        ? product.variants?.[0]
            ?.originalPrice >
          product.variants?.[0]?.price
        : true

    return (
      matchesSearch &&
      matchesPet &&
      matchesCategory &&
      matchesSale
    )
  })

  // SORTING
  if (sort === 'priceLow') {

    filtered = [...filtered].sort(

      (a, b) =>

        a.variants[0].price -
        b.variants[0].price
    )
  }

  if (sort === 'priceHigh') {

    filtered = [...filtered].sort(

      (a, b) =>

        b.variants[0].price -
        a.variants[0].price
    )
  }

  if (sort === 'new') {

    filtered = [...filtered].sort(

      (a, b) => b.id - a.id
    )
  }

  return (

    <div className='bg-[#f8f8f8] min-h-screen'>

      {/* NAVBAR */}
      <Navbar />

      {/* PAGE */}
      <div className='max-w-[1440px] mx-auto px-4 md:px-8 py-12'>

        {/* HEADER */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10'>

          <div>

            <h1 className='text-5xl font-bold text-[#0D2B5C] mb-3'>

              Pet Food Shop

            </h1>

            <p className='text-gray-500 text-lg max-w-3xl'>

              Explore premium pet food products for dogs, cats, birds, fish, rabbits, hamsters, and more.

            </p>

          </div>

          {/* SEARCH + SORT */}
          <div className='flex flex-col md:flex-row gap-4 w-full lg:w-auto'>

            <ProductSearch
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <ProductSort
              sort={sort}
              onSort={setSort}
            />

          </div>

        </div>

        {/* QUICK FILTERS */}
        <div className='flex flex-wrap gap-4 mb-10'>

          {[
            'all',
            'Dog',
            'Cat',
            'Fish',
            'Bird',
            'Rabbit',
            'Hamster',
          ].map((pet) => (

            <button
              key={pet}
              onClick={() =>
                setSelectedPet(pet)
              }
              className={`

                px-6
                py-3
                rounded-full
                font-semibold
                transition-all

                ${
                  selectedPet === pet

                    ? 'bg-orange-500 text-white shadow-md'

                    : 'bg-white hover:bg-orange-100 text-[#0D2B5C]'
                }
              `}
            >

              {pet}

            </button>

          ))}

        </div>

        {/* MAIN CONTENT */}
        <div className='flex gap-8'>

          {/* SIDEBAR */}
          <div className='hidden xl:block w-[300px] flex-shrink-0'>

            <ProductFilters
              selectedCategory={
                selectedCategory
              }
              setSelectedCategory={
                setSelectedCategory
              }
            />

          </div>

          {/* PRODUCTS */}
          <div className='flex-1'>

            {/* RESULTS */}
            <div className='flex items-center justify-between mb-8 flex-wrap gap-4'>

              <p className='text-gray-500 text-lg'>

                {filtered.length}
                {' '}
                Products Found

              </p>

              {saleParam === 'true' && (

                <div className='bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold text-sm'>

                  Sale Products

                </div>

              )}

            </div>

            {/* GRID */}
            <ProductGrid
              products={filtered}
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
            />

          </div>

        </div>

      </div>

    </div>
  )
}

export default Shop