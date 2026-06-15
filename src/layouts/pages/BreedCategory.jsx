import { useParams } from "react-router-dom"

import breedData from "../../data/breeds"

import BreedSlider from "../../components/breeds/BreedSlider"

import Navbar from "../../components/Navbar"

import Footer from "../../components/Footer"

const BreedCategory = () => {

  const { pet } = useParams()

  const filteredBreeds = breedData.filter(
    (item) => item.category === pet
  )

  return (

    <div className="bg-[#f8f8f8] min-h-screen">

      <Navbar />

     <div className="pt-[140px] pb-16">

    <h1
  className="
    text-5xl md:text-7xl
    font-bold
    text-center
    leading-[1.1]
    mb-16
    capitalize
  "
>

          {pet} Breeds

        </h1>

        <BreedSlider breeds={filteredBreeds} />

      </div>

      <Footer />

    </div>

  )
}

export default BreedCategory