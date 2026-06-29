export const buildFilterQuery = (query = {}) => {
  const filters = {};

  if (query.status) {
    filters.status = String(query.status).trim();
  }

  if (query.q) {
    filters.q = String(query.q).trim();
  }

  if (query.sortBy) {
    filters.sortBy = String(query.sortBy).trim();
  }

  if (query.order) {
    filters.order = String(query.order).trim();
  }

  return filters;
};
