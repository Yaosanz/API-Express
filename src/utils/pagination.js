const { Op } = require('sequelize');

const getPagination = (page, size) => {
  const limit = size ? +size : 3; // default limit to 3 items per page
  const offset = 0 + (page - 1) * limit;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count, rows: results } = data;
  page = page ? +page : 0;
  const total_pages = Math.ceil(count / limit);

  return {
    count,
    page_context: {
      page,
      total_pages,
    },
    results,
  };
};

function parseQueryParams(params) {
  const page = parseInt(params.page || 1);
  const size = parseInt(params.per_page || 20);
  const { limit, offset } = getPagination(page, size);

  let queryOptions = {
    where: {},
  };

  // Example: Search functionality
  if (params.search) {
    queryOptions.where.name = { [Op.iLike]: `%${params.search}%` }; // Adjust for your search field
  }

  // Example: Generic filters
  for (let [key, value] of Object.entries(params)) {
    if (key !== 'search' && key !== 'per_page' && key !== 'page') {
      // Exclude search or other special parameters
      queryOptions.where[key] = value;
    }
  }

  // Add other query options like sorting, pagination, etc., as needed

  return queryOptions;
}

module.exports = {
  getPagination,
  getPagingData,
  parseQueryParams,
};
