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
    key: 'applod',
    image: getFile('Applod_Desktop_646X388px_1.webp'),
    title: 'Applod — Up to 15% OFF',
    cta: '',
    link: '/brands/applod',
  },
  {
    key: 'furpro',
    image: getFile('Furpro_1_29a3db6b-7f61-43ba-961e-42429797f387.webp'),
    title: 'FurPro grooming — New arrivals',
    cta: '',
    link: '/brands/furpro',
  },
]

export default spotlight
