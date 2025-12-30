const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  categories: `${API_BASE_URL}/AdminCategory`,
  subcategories: `${API_BASE_URL}/AdminSubCategory`,
  vendors: `${API_BASE_URL}/AdminVendor`,
  shopkeepers: `${API_BASE_URL}/AdminShopkeeper`,
  userLogin: `${API_BASE_URL}/UserAuth/login`,
  adminProducts: `${API_BASE_URL}/AdminProduct`,
  vendorProducts: `${API_BASE_URL}/VendorProduct`
};

export default API_BASE_URL;