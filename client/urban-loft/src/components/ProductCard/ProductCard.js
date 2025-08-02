import React from 'react';
import { ProductService } from '../../services/productService';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  const isInStock = product.stock_level > 0;

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image-container">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="product-image"
          
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        {!isInStock && <div className="out-of-stock-overlay">Out of Stock</div>}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description}
        </p>
        
        <div className="product-details">
          <span className="product-price">
            {ProductService.formatPrice(product.price)}
          </span>
          
          <div className="product-stock">
            {isInStock ? (
              <span className="in-stock">In Stock ({product.stock_level})</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;