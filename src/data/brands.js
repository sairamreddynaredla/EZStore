// Brand data extracted from products
export const brands = [
  {
    id: 1,
    name: 'Royal Canin',
    logo: 'royal-canin',
    slug: 'royal-canin',
    featured: true,
  },
  {
  id: 2,
  name: 'Pedigree',
  logo: 'pedigree',
  slug: 'pedigree',
  featured: true,
},
  {
    id: 3,
    name: 'Drools',
    logo: 'drools',
    slug: 'drools',
    featured: true,
  },
  {
    id: 4,
    name: 'Farmina',
    logo: 'farmina',
    slug: 'farmina',
    featured: true,
  },
    {
  id: 5,
  name: 'JerHigh',
  logo: 'jerhigh',
  slug: 'jerhigh',
},

{
  id: 6,
  name: 'Himalaya',
  logo: 'himalaya',
  slug: 'himalaya',
},
  {
    id: 7,
    name: 'Taste Of The Wild',
    logo: 'taste-of-the-wild',
    slug: 'taste-of-the-wild',
    featured: true,
  },
  
{
  id: 8,
  name: 'Goodies',
  logo: 'goodies',
  slug: 'goodies',
},

{
  id: 9,
  name: 'SmartHeart',
  logo: 'smartheart',
  slug: 'smartheart',
},

{
  id: 10,
  name: 'Acana',
  logo: 'acana',
  slug: 'acana',
}, 
  {
    id: 11,
    name: 'Whiskas',
    logo: 'whiskas',
    slug: 'whiskas',
    featured: true,
  },
  {
    id: 12,
    name: 'Me-O',
    logo: 'meo',
    slug: 'me-o',
    featured: true,
  },
  {
    id: 13,
    name: 'Sheba',
    logo: 'sheba',
    slug: 'sheba',
    featured: true,
  },
  {
    id: 14,
    name: 'Purina',
    logo: 'purina',
    slug: 'purina',
    featured: true,
  },
  {
    id: 15,
    name: 'Orijen',
    logo: 'orijen',
    slug: 'orijen',
    featured: true,
  },
  {
    id: 16,
    name: 'Kennel Kitchen',
    logo: 'kennel-kitchen',
    slug: 'kennel-kitchen',
    featured: true,
  },
]

// Get featured brands for carousel
export const getFeaturedBrands = () => {
  return brands.filter(brand => brand.featured)
}

// Get brand logo filename
export const getBrandLogo = (brandName) => {
  const nameToFind = String(brandName ?? '').toLowerCase()
  const brand = brands.find((b) => String(b.name ?? '').toLowerCase() === nameToFind)
  return brand?.logo
}
