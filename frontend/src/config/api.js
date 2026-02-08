// Default to the backend dev URL used by Visual Studio (launchSettings) when not set in env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Categories
  categories: `${API_BASE_URL}/categories`,
  subcategories: `${API_BASE_URL}/categories/sub`, // inferred from CategoryController

  // Users (Admin/Vendor/Shopkeeper management usually goes through User or specific dashboard controllers)
  // Assuming these exist or will be mapped to standard user endpoints for now
  vendors: `${API_BASE_URL}/users/vendors`, // Placeholder if specific endpoint exists
  shopkeepers: `${API_BASE_URL}/users/shopkeepers`, // Placeholder

  // Auth & Registration
  shopkeeperRegister: `${API_BASE_URL}/users/shopkeeper-register`,
  vendorRegister: `${API_BASE_URL}/users/vendor-register`,
  userLogin: `${API_BASE_URL}/users/login`,

  // Products
  adminProducts: `${API_BASE_URL}/products`,
  vendorProducts: `${API_BASE_URL}/products`, // Vendor likely uses same base endpoint + query/filter
  publicProducts: `${API_BASE_URL}/products`,

  // Public/Shared
  publicCategories: `${API_BASE_URL}/categories`,
  publicCategoryProducts: `${API_BASE_URL}/products/category`, // Need to verify if this exists, likely just /products?category=...
  publicSubCategoryProducts: `${API_BASE_URL}/products/subcategory`,
  publicSearch: `${API_BASE_URL}/products/search`
};

export default API_BASE_URL;