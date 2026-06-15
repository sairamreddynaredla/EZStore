// Use Vite glob import to avoid static import parsing issues
const files = import.meta.glob('../assets/spotlight/*.{webp,png,jpg,jpeg}', { eager: true, import: 'default' })

const getFile = (name) => {
  const key = `../assets/spotlight/${name}`
  return files[key] || null
}

const spotlight = [
  {
    key: 'zl',
    image: getFile('EZstore.png'),
    title: 'Zigly Lifestyle — Up to 50% OFF',
    cta: '',
    link: '/brands/zigly-lifestyle',
  },
  {
    key: 'furpro',
    image: getFile('Furpro.webp'),
    title: 'FurPro grooming — New arrivals',
    cta: '',
    link: '/brands/furpro',
  },
]

export default spotlight
