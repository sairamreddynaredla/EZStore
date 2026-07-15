// Utility to generate category banner key
// Example: getCategoryBannerKey('dogs', 'wet-food') => 'dogs-wet-food'
export function getCategoryBannerKey(petType, categorySlug) {
  return `${petType}-${categorySlug}`;
}
