import React, { useState, useEffect } from 'react';
import './store.css';
import { API_URL } from '../utils/apiUrl';

const CATEGORY_LABELS = {
  all: 'All Products',
  polo: 'Polo Shirts',
  cap: 'Caps',
  bangle: 'Bangles',
  accessory: 'Accessories',
};

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [ads, setAds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [addedId, setAddedId] = useState(null);
  const [orderForm, setOrderForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => { fetchProducts(); fetchAds(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }
      const data = await res.json();
      setProducts(data);
      setFetchError('');
    } catch (e) {
      console.error('Error fetching products:', e);
      setFetchError('Unable to load products. Please check your backend server or API URL.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAds = async () => {
    try {
      const res = await fetch(`${API_URL}/ads`);
      const data = await res.json();
      setAds(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error fetching ads:', e);
    }
  };

  const addToCart = (product) => {
    const sizes = Array.isArray(product.sizes) ? product.sizes : [product.sizes];
    const size = selectedSize[product._id] || selectedSize[product.id] || sizes[0];
    setCart(prev => [...prev, { ...product, selectedSize: size }]);
    setAddedId(product._id || product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutError('');
    setCheckoutSuccess('');
    setCheckoutLoading(true);

    if (!orderForm.name || !orderForm.email || !orderForm.phone || !orderForm.address) {
      setCheckoutError('Please fill in all customer details to complete your order.');
      setCheckoutLoading(false);
      return;
    }

    if (cart.length === 0) {
      setCheckoutError('Your cart is empty. Add at least one item before checkout.');
      setCheckoutLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orderForm.name.trim(),
          email: orderForm.email.trim(),
          phone: orderForm.phone.trim(),
          address: orderForm.address.trim(),
          items: cart.map(item => ({ id: item.id || item._id, name: item.name, price: item.price, selectedSize: item.selectedSize }))
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to place order.');

      setCheckoutSuccess('✅ Order placed successfully! We will contact you soon.');
      setCart([]);
      setOrderForm({ name: '', email: '', phone: '', address: '' });
      setCartOpen(false);
    } catch (err) {
      setCheckoutError(err.message || 'Unable to complete checkout.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);

  if (loading) {
    return (
      <div className="store-loading">
        <div className="store-spinner" />
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="store">
      <div className="page-hero">
        <h1>Official Store</h1>
        <p>August 93 Club — Ohanze Congress Merchandise</p>
      </div>

      {ads.length > 0 && (
        <div className="store-ad-banner">
          <div>
            <p className="store-ad-label">Featured promotion</p>
            <h2>{ads[0].title}</h2>
            <p>{ads[0].message}</p>
          </div>
          <div className="store-ad-actions">
            <span className="store-ad-category">{ads[0].category === 'all' ? 'All products' : ads[0].category}</span>
            <button>{ads[0].ctaText || 'Shop now'}</button>
          </div>
        </div>
      )}

      <div className="store-body">
        {/* FILTERS */}
        <div className="store-filters">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`filter-btn ${selectedCategory === key ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* PRODUCTS */}
        {fetchError ? (
          <div className="store-empty">
            <div className="store-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <path d="M12 3v18" strokeLinecap="round" />
                <path d="M3 12h18" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Unable to load products</h3>
            <p>{fetchError}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="store-empty">
            <div className="store-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <h3>No products available</h3>
            <p>{selectedCategory === 'all'
              ? 'Check back soon for merchandise!'
              : `No ${CATEGORY_LABELS[selectedCategory]} available yet.`}
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => {
              const sizes = Array.isArray(product.sizes) ? product.sizes : [product.sizes];
              const pid = product._id || product.id;
              const isAdded = addedId === pid;
              const outOfStock = product.stock === 0;

              return (
                <div key={pid} className={`product-card ${outOfStock ? 'out-of-stock' : ''}`}>
                  <div className="product-img-wrap">
                    <img
                      src={product.imageUrl || product.image}
                      alt={product.name}
                      className="product-img"
                      onError={(e) => { e.target.src = 'https://placehold.co/300x300/f0eded/999?text=No+Image'; }}
                    />
                    {product.stock > 0 && product.stock < 10 && (
                      <span className="badge-low">Only {product.stock} left</span>
                    )}
                    {outOfStock && <span className="badge-out">Sold Out</span>}
                    <span className="cat-badge">{product.category}</span>
                  </div>

                  <div className="product-body">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-desc">{product.description}</p>

                    {sizes.length > 1 && (
                      <div className="size-row">
                        <span className="size-label">Size</span>
                        <div className="size-options">
                          {sizes.map(sz => (
                            <button
                              key={sz}
                              className={`size-btn ${(selectedSize[pid] || sizes[0]) === sz ? 'active' : ''}`}
                              onClick={() => setSelectedSize(prev => ({ ...prev, [pid]: sz }))}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="product-foot">
                      <div>
                        <div className="product-price">
                          ₦{Number(product.price).toLocaleString()}
                        </div>
                        <div className="product-stock">
                          {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
                        </div>
                      </div>
                      <button
                        className={`cart-btn ${isAdded ? 'added' : ''} ${outOfStock ? 'disabled' : ''}`}
                        onClick={() => !outOfStock && addToCart(product)}
                        disabled={outOfStock}
                      >
                        {outOfStock ? 'Sold Out' : isAdded ? (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Added
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                              <line x1="3" y1="6" x2="21" y2="6"/>
                              <path d="M16 10a4 4 0 01-8 0"/>
                            </svg>
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CART BUBBLE */}
      {cart.length > 0 && (
        <button className="cart-bubble" onClick={() => setCartOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <span className="cart-bubble-count">{cart.length}</span>
          <span className="cart-bubble-label">View Cart</span>
        </button>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-drawer-head">
              <h2>Your Cart ({cart.length})</h2>
              <button className="cart-close" onClick={() => setCartOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="cart-items">
              {cart.map((item, i) => (
                <div key={i} className="cart-item">
                  <img src={item.imageUrl || item.image} alt={item.name}
                    onError={(e) => { e.target.src = 'https://placehold.co/60x60/f0eded/999?text=?'; }} />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    {item.selectedSize && <p className="cart-item-size">Size: {item.selectedSize}</p>}
                    <p className="cart-item-price">₦{Number(item.price).toLocaleString()}</p>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(i)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div style={{ padding:'1rem 1.2rem 1.5rem', borderTop:'1px solid #eee', background:'#fafafa' }}>
              <div className="cart-total">
                <span>Total</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
              <form onSubmit={handleCheckout} style={{ display:'grid', gap:'1rem', marginTop:'1rem' }}>
                {checkoutError && <div className="checkout-message error">{checkoutError}</div>}
                {checkoutSuccess && <div className="checkout-message success">{checkoutSuccess}</div>}
                <label className="checkout-field">
                  <span>Your name</span>
                  <input type="text" value={orderForm.name} onChange={(e) => setOrderForm(prev => ({ ...prev, name: e.target.value }))} required />
                </label>
                <label className="checkout-field">
                  <span>Email</span>
                  <input type="email" value={orderForm.email} onChange={(e) => setOrderForm(prev => ({ ...prev, email: e.target.value }))} required />
                </label>
                <label className="checkout-field">
                  <span>Phone</span>
                  <input type="tel" value={orderForm.phone} onChange={(e) => setOrderForm(prev => ({ ...prev, phone: e.target.value }))} required />
                </label>
                <label className="checkout-field">
                  <span>Delivery address</span>
                  <textarea value={orderForm.address} onChange={(e) => setOrderForm(prev => ({ ...prev, address: e.target.value }))} required rows="3" />
                </label>
                <button type="submit" className="checkout-btn" disabled={checkoutLoading}>
                  {checkoutLoading ? 'Placing order...' : 'Confirm Purchase'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}