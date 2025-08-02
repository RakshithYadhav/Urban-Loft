import React from 'react';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import './Home.css';

const Home = () => {
  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Urban Loft</h1>
          <p className="hero-subtitle">
            Discover modern furniture that transforms your space into a stylish sanctuary
          </p>
          <button className="hero-cta">Shop Now</button>
        </div>
      </div>

      <section className="featured-section">
        <ProductGrid
          title="Featured Products"
          featured={true}
          limit={8}
          onProductClick={handleProductClick}
        />
      </section>

      <section className="all-products-section">
        <ProductGrid
          title="All Products"
          featured={false}
          limit={12}
          onProductClick={handleProductClick}
        />
      </section>
    </div>
  );
};

export default Home;