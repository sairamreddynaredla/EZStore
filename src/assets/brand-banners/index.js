// Auto-generated helper to import and export all brand banner images
const banners = import.meta.glob('./*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
});

const bannerMap = Object.fromEntries(
  Object.entries(banners).map(([path, src]) => {
    const fileName = path.split('/').pop().replace(/\.[^/.]+$/, '');
    // Use prefix before first underscore to handle files with hashes/suffixes
    const base = String(fileName).split('_')[0];
    const key = String(base)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9-]/g, '');
    return [key, src];
  })
);

export default bannerMap;

export const bannersArray = Object.values(bannerMap);
