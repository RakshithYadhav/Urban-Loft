import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { ProductService } from '../../services/productService';
import './ProductGrid.css';

const ProductGrid = ({ 
  title = "Our Products", 
  featured = false, 
  limit = 20,
  onProductClick 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (featured) {
          response = await ProductService.getFeaturedProducts(limit);
        } else {
          response = await ProductService.getAllProducts(limit);
        }
        
        setProducts(response.products || []);
      } catch (err) {
        setError(err.message || 'Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [featured, limit]);

  const handleProductClick = (product) => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  if (loading) {
    return (
      <div className="product-grid-container">
        <h2 className="product-grid-title">{title}</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-grid-container">
        <h2 className="product-grid-title">{title}</h2>
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-grid-container">
        <h2 className="product-grid-title">{title}</h2>
        <div className="empty-container">
          <p>No products available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <h2 className="product-grid-title">{title}</h2>
      <div className={`product-grid ${featured ? 'featured-grid' : ''}`}>
        {products.map((product) => (
          <ProductCard
            key={product.product_id}
            product={product}
            onClick={handleProductClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;