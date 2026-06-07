// Navbar dropdown data for Dogs and Cats
// Each item: { label, path }

import { dogCategories } from '../data/dogCategories';
import { catCategories } from '../data/catCategories';

export const dogsDropdown = dogCategories.map(cat => ({
  label: cat.name,
  path: `/dogs/${cat.slug}`,
}));

export const catsDropdown = catCategories.map(cat => ({
  label: cat.name,
  path: `/cats/${cat.slug}`,
}));
