import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const size = selectedSize[product.id] || (Array.isArray(product.sizes) ? product.sizes[0] : product.sizes);
    const cartItem = { ...product, selectedSize: size };
    setCart([...cart, cartItem]);
    alert(`✅ ${product.name} (${size}) added to cart!`);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading amazing products...</p>
      </div>
    );
  }

  return (
    <div className="store-container">
      <div className="store-content">
        {/* Header */}
        <div className="store-header">
          <h1 className="store-title">🛍️ Ohanze Congress Store</h1>
          <p className="store-subtitle">Official August 93 Club Merchandise</p>
        </div>

        {/* Category Filter */}
        <div className="filter-container">
          {['all', 'polo', 'cap', 'bangle', 'accessory'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
            >
              {category === 'all' ? '🌟 All Products' : 
               category === 'polo' ? '👕 Polo Shirts' :
               category === 'cap' ? '🧢 Caps' :
               category === 'bangle' ? '📿 Bangles' : '🎁 Accessories'}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3 className="empty-title">No Products Available</h3>
            <p className="empty-text">
              {selectedCategory === 'all' 
                ? 'Check back soon for amazing Ohanze Congress merchandise!'
                : `No ${selectedCategory} products available yet. Try another category!`}
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => {
              const sizes = Array.isArray(product.sizes) ? product.sizes : [product.sizes];
              return (
                <div key={product.id} className="product-card">
                  {/* Product Image */}
                  <div className="image-container">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300/7f1d1d/ffffff?text=No+Image';
                      }}
                    />
                    {product.stock < 10 && product.stock > 0 && (
                      <span className="badge-low-stock">
                        Only {product.stock} left!
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="badge-out-of-stock">Out of Stock</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="product-info">
                    <div className="product-header">
                      <h3 className="product-name">{product.name}</h3>
                      <span className="category-badge">
                        {product.category.toUpperCase()}
                      </span>
                    </div>

                    <p className="product-description">{product.description}</p>

                    {/* Size Selection */}
                    <div className="size-section">
                      <div className="size-label">Select Size:</div>
                      <div className="size-buttons">
                        {sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize({...selectedSize, [product.id]: size})}
                            className={`size-button ${selectedSize[product.id] === size ? 'active' : ''}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="product-footer">
                      <div>
                        <div className="price">
                          ₦{Number(product.price).toLocaleString()}
                        </div>
                        <div className="stock">
                          📦 {product.stock} in stock
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`add-to-cart-button ${product.stock === 0 ? 'disabled' : ''}`}
                      >
                        {product.stock === 0 ? '❌ Sold Out' : '🛒 Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cart Badge */}
        {cart.length > 0 && (
          <div className="cart-badge">
            <span className="cart-icon">🛒</span>
            <span className="cart-text">{cart.length} items in cart</span>
          </div>
        )}
      </div>
    </div>
  );
}