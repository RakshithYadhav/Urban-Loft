const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export class ProductService {
  static async getAllProducts(limit = 20, offset = 0) {
    try {
      console.log('Fetching products from:', `${API_BASE_URL}/products?limit=${limit}&offset=${offset}`);
      const response = await fetch(`${API_BASE_URL}/products?limit=${limit}&offset=${offset}`);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.general || 'Failed to fetch products');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      console.error('Error details:', error.message);
      throw error;
    }
  }

  static async getFeaturedProducts(limit = 8) {
    try {
      console.log('Fetching featured products from:', `${API_BASE_URL}/products/featured?limit=${limit}`);
      const response = await fetch(`${API_BASE_URL}/products/featured?limit=${limit}`);
      console.log('Featured response status:', response.status);
      
      const data = await response.json();
      console.log('Featured response data:', data);
      
      if (!response.ok) {
        throw new Error(data.general || 'Failed to fetch featured products');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      console.error('Error details:', error.message);
      throw error;
    }
  }

  static async getProductById(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.general || 'Failed to fetch product');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  static formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}