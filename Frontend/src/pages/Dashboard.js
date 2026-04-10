import React, { useEffect, useState, useCallback } from 'react';

const API_URL = (() => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  const host = window.location.hostname;
  const protocol = window.location.protocol;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1';
  const isLocalIp = /^\d+\.\d+\.\d+\.\d+$/.test(host);
  if (isLocalHost || isLocalIp) {
    return `${protocol}//${host}:5002/api`;
  }
  return `${protocol}//${host}/api`;
})();

const token = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  'x-auth-token': token()
});

const authHeaders = () => ({
  'x-auth-token': token()
});

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('overview');
  const [pending, setPending] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState('');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productActionLoading, setProductActionLoading] = useState(false);
  const [productError, setProductError] = useState('');
  const [productForm, setProductForm] = useState({
    name: '', category: 'polo', price: '', stock: '', description: '', imageUrl: '', sizes: 'S, M, L'
  });
  const [ads, setAds] = useState([]);
  const [adsLoading, setAdsLoading] = useState(false);
  const [adActionLoading, setAdActionLoading] = useState(false);
  const [adError, setAdError] = useState('');
  const [adForm, setAdForm] = useState({
    title: '', message: '', ctaText: 'Shop now', imageUrl: '', imageFile: null, category: 'all'
  });

  const inputStyle = {
    width: '100%',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.12)',
    background: '#111',
    color: 'white',
    padding: '0.85rem 1rem',
    fontSize: '0.95rem',
    outline: 'none'
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  };

  useEffect(() => {
    if (!token()) { window.location.href = '/admin/login'; return; }
    fetch(`${API_URL}/auth/me`, { headers: headers() })
      .then(r => r.json()).then(data => setUser(data.user || data))
      .catch(logout);
  }, []);

  const loadPending = useCallback(() => {
    fetch(`${API_URL}/auth/pending`, { headers: headers() })
      .then(r => r.json()).then(setPending).catch(() => {});
  }, []);

  const loadOrders = useCallback(() => {
    fetch(`${API_URL}/orders`, { headers: headers() })
      .then(r => r.json()).then(setOrders).catch(() => {});
    fetch(`${API_URL}/orders/stats/summary`, { headers: headers() })
      .then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const loadProducts = useCallback(() => {
    setProductsLoading(true);
    fetch(`${API_URL}/products`, { headers: headers() })
      .then(async (r) => {
        const data = await r.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      })
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false));
  }, []);

  const loadAds = useCallback(() => {
    setAdsLoading(true);
    fetch(`${API_URL}/ads`)
      .then(async (r) => {
        const data = await r.json();
        setAds(Array.isArray(data) ? data : data.ads || []);
      })
      .catch(() => setAds([]))
      .finally(() => setAdsLoading(false));
  }, []);

  useEffect(() => {
    if (tab === 'approvals') loadPending();
    if (tab === 'orders' || tab === 'overview') loadOrders();
    if (tab === 'products') loadProducts();
    if (tab === 'ads') loadAds();
  }, [tab, loadPending, loadOrders, loadProducts, loadAds]);

  const handleApproval = async (id, action) => {
    await fetch(`${API_URL}/auth/approve/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ action })
    });
    showToast(action === 'approve' ? '✅ Admin approved!' : '❌ Admin declined.');
    loadPending();
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductError('');
    setProductActionLoading(true);

    try {
      const payload = {
        name: productForm.name.trim(),
        category: productForm.category,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        description: productForm.description.trim(),
        imageUrl: productForm.imageUrl.trim() || undefined,
        sizes: productForm.sizes.split(',').map(s => s.trim()).filter(Boolean)
      };

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to add product.');

      setProductForm({ name: '', category: 'polo', price: '', stock: '', description: '', imageUrl: '', sizes: 'S, M, L' });
      showToast('✅ Product added successfully!');
      loadProducts();
    } catch (err) {
      setProductError(err.message || 'Could not save product.');
    } finally {
      setProductActionLoading(false);
    }
  };

  const handleAddAd = async (e) => {
    e.preventDefault();
    setAdError('');
    setAdActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', adForm.title.trim());
      formData.append('message', adForm.message.trim());
      formData.append('ctaText', adForm.ctaText.trim() || 'Shop now');
      formData.append('category', adForm.category);
      if (adForm.imageFile) {
        formData.append('image', adForm.imageFile);
      } else if (adForm.imageUrl.trim()) {
        formData.append('imageUrl', adForm.imageUrl.trim());
      }

      const response = await fetch(`${API_URL}/ads`, {
        method: 'POST',
        headers: authHeaders(),
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to add ad.');

      setAdForm({ title: '', message: '', ctaText: 'Shop now', imageUrl: '', imageFile: null, category: 'all' });
      showToast('📣 Ad published for the store!');
      loadAds();
    } catch (err) {
      setAdError(err.message || 'Could not save ad.');
    } finally {
      setAdActionLoading(false);
    }
  };

  if (!user) return (
    <div style={{ minHeight:'100vh', background:'#0d0d0d', display:'flex',
      alignItems:'center', justifyContent:'center', color:'white', fontFamily:'Inter,sans-serif' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:40, height:40, border:'3px solid rgba(196,30,58,0.3)',
          borderTopColor:'#c41e3a', borderRadius:'50%', animation:'spin 0.7s linear infinite',
          margin:'0 auto 1rem' }} />
        Loading...
      </div>
    </div>
  );

  const tabs = [
    { id:'overview',  label:'Overview',  icon:'📊' },
    { id:'orders',    label:'Orders',    icon:'📦' },
    { id:'approvals', label:'Approvals', icon:'👥', badge: pending.length },
    { id:'products',  label:'Products',  icon:'🛍️' },
    { id:'ads',       label:'Ads',       icon:'📣', badge: ads.length },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#0d0d0d', fontFamily:'Inter,sans-serif', color:'white' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:24, right:24, zIndex:9999,
          background:'#1a1a1a', border:'1px solid rgba(196,30,58,0.4)',
          color:'white', padding:'0.875rem 1.5rem', borderRadius:12,
          boxShadow:'0 8px 32px rgba(0,0,0,0.5)', fontSize:'0.9rem',
          animation:'fadeUp 0.3s ease' }}>
          {toast}
        </div>
      )}

      {/* Sidebar */}
      <div style={{ position:'fixed', left:0, top:0, bottom:0, width:240,
        background:'linear-gradient(180deg,#1a0000 0%,#0d0d0d 100%)',
        borderRight:'1px solid rgba(255,255,255,0.06)', padding:'2rem 1rem',
        display:'flex', flexDirection:'column', zIndex:100 }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'2.5rem', padding:'0 0.5rem' }}>
          <div style={{ width:40, height:40, borderRadius:'50%',
            background:'linear-gradient(135deg,#c41e3a,#7a0a0a)',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6l-9-4z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:'0.85rem' }}>August 93 Club</div>
            <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', letterSpacing:1 }}>ADMIN PANEL</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:12,
                padding:'0.75rem 1rem', borderRadius:10, border:'none', cursor:'pointer',
                marginBottom:4, position:'relative', textAlign:'left',
                background: tab===t.id ? 'rgba(196,30,58,0.18)' : 'transparent',
                color: tab===t.id ? '#f87171' : 'rgba(255,255,255,0.55)',
                fontWeight: tab===t.id ? 600 : 400, fontSize:'0.88rem',
                transition:'all 0.2s' }}>
              <span style={{ fontSize:'1.1rem' }}>{t.icon}</span>
              {t.label}
              {t.badge > 0 && (
                <span style={{ marginLeft:'auto', background:'#c41e3a', color:'white',
                  fontSize:'0.7rem', fontWeight:700, padding:'2px 7px',
                  borderRadius:20, minWidth:20, textAlign:'center' }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'0.75rem' }}>
            <div style={{ width:32, height:32, borderRadius:'50%',
              background:'linear-gradient(135deg,#c41e3a,#7a0a0a)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'0.85rem', fontWeight:700 }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:'0.82rem', fontWeight:600 }}>{user.name}</div>
              <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)' }}>{user.role}</div>
            </div>
          </div>
          <button onClick={logout}
            style={{ width:'100%', padding:'0.6rem', borderRadius:8, border:'1px solid rgba(196,30,58,0.3)',
              background:'transparent', color:'#f87171', fontSize:'0.82rem', cursor:'pointer',
              transition:'all 0.2s' }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft:240, padding:'2rem' }}>

        {/* Top Nav Bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', marginBottom:'1.5rem', padding:'1rem 1.25rem', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <div style={{ width:48, height:48, borderRadius:'14px', background:'linear-gradient(135deg,#c41e3a,#7a0a0a)', display:'grid', placeItems:'center', color:'white', fontWeight:700, fontSize:'1.1rem' }}>
              A
            </div>
            <div>
              <div style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.65)', letterSpacing:'0.3px' }}>Admin Navigation</div>
              <div style={{ fontSize:'1.2rem', fontWeight:700 }}>Dashboard Control</div>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap' }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding:'0.75rem 1rem', borderRadius:12, border:'1px solid rgba(255,255,255,0.1)', background: tab === t.id ? 'rgba(196,30,58,0.2)' : 'transparent', color: tab === t.id ? '#fca5a5' : 'rgba(255,255,255,0.75)', cursor:'pointer', fontWeight:600, fontSize:'0.85rem' }}>
                {t.label}
              </button>
            ))}
            <button onClick={logout}
              style={{ padding:'0.75rem 1rem', borderRadius:12, border:'1px solid rgba(196,30,58,0.4)', background:'rgba(196,30,58,0.16)', color:'#f87171', cursor:'pointer', fontWeight:700, fontSize:'0.85rem' }}>
              Sign out
            </button>
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom:'2rem' }}>
          <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-0.5px' }}>
            {tabs.find(t=>t.id===tab)?.icon} {tabs.find(t=>t.id===tab)?.label}
          </h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.85rem', marginTop:4 }}>
            {new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
          </p>
        </div>

        {/* OVERVIEW */}
        {tab==='overview' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'2rem' }}>
              {[
                { label:'Total Orders', value: stats?.totalOrders ?? 0, icon:'📦', color:'#c41e3a' },
                { label:'Pending Orders', value: stats?.pendingOrders ?? 0, icon:'⏳', color:'#d97706' },
                { label:'Completed', value: stats?.completedOrders ?? 0, icon:'✅', color:'#16a34a' },
                { label:'Revenue', value: `₦${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon:'💰', color:'#7c3aed' },
              ].map((s,i) => (
                <div key={i} style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.07)',
                  borderRadius:14, padding:'1.25rem' }}>
                  <div style={{ fontSize:'1.5rem', marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:'1.5rem', fontWeight:800, color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.45)', marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {pending.length > 0 && (
              <div style={{ background:'rgba(196,30,58,0.1)', border:'1px solid rgba(196,30,58,0.3)',
                borderRadius:12, padding:'1rem 1.25rem', cursor:'pointer' }}
                onClick={() => setTab('approvals')}>
                🔔 <strong>{pending.length} pending admin request{pending.length>1?'s':''}</strong> — click to review
              </div>
            )}
          </div>
        )}

        {/* ORDERS */}
        {tab==='orders' && (
          <div style={{ background:'#1a1a1a', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>
            {orders.length === 0 ? (
              <div style={{ padding:'3rem', textAlign:'center', color:'rgba(255,255,255,0.3)' }}>
                No orders yet
              </div>
            ) : (
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                    {['Customer','Email','Amount','Status','Date'].map(h => (
                      <th key={h} style={{ padding:'1rem', textAlign:'left',
                        color:'rgba(255,255,255,0.4)', fontWeight:600, fontSize:'0.75rem',
                        textTransform:'uppercase', letterSpacing:0.8 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o,i) => (
                    <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding:'1rem', fontWeight:600 }}>{o.customerName}</td>
                      <td style={{ padding:'1rem', color:'rgba(255,255,255,0.5)' }}>{o.email}</td>
                      <td style={{ padding:'1rem', color:'#4ade80' }}>₦{o.totalAmount?.toLocaleString()}</td>
                      <td style={{ padding:'1rem' }}>
                        <span style={{ padding:'3px 10px', borderRadius:20, fontSize:'0.75rem', fontWeight:600,
                          background: o.status==='completed' ? 'rgba(22,163,74,0.2)' : 'rgba(217,119,6,0.2)',
                          color: o.status==='completed' ? '#4ade80' : '#fbbf24' }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding:'1rem', color:'rgba(255,255,255,0.4)' }}>
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* APPROVALS */}
        {tab==='approvals' && (
          <div>
            {pending.length === 0 ? (
              <div style={{ background:'#1a1a1a', borderRadius:14, padding:'3rem',
                textAlign:'center', color:'rgba(255,255,255,0.3)',
                border:'1px solid rgba(255,255,255,0.07)' }}>
                🎉 No pending requests
              </div>
            ) : pending.map((u,i) => (
              <div key={i} style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.07)',
                borderRadius:14, padding:'1.5rem', marginBottom:'1rem',
                display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%',
                    background:'linear-gradient(135deg,#c41e3a,#7a0a0a)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'1.1rem', fontWeight:700, flexShrink:0 }}>
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight:700, marginBottom:2 }}>{u.name}</div>
                    <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.45)' }}>{u.email}</div>
                    {u.reason && <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.3)',
                      marginTop:4, maxWidth:400 }}>"{u.reason}"</div>}
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  <button onClick={() => handleApproval(u._id, 'approve')}
                    style={{ padding:'0.55rem 1.25rem', borderRadius:8, border:'none',
                      background:'linear-gradient(135deg,#16a34a,#14532d)',
                      color:'white', fontWeight:600, fontSize:'0.82rem', cursor:'pointer' }}>
                    ✅ Approve
                  </button>
                  <button onClick={() => handleApproval(u._id, 'decline')}
                    style={{ padding:'0.55rem 1.25rem', borderRadius:8,
                      border:'1px solid rgba(196,30,58,0.4)',
                      background:'transparent', color:'#f87171',
                      fontWeight:600, fontSize:'0.82rem', cursor:'pointer' }}>
                    ❌ Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCTS */}
        {tab==='products' && (
          <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:'1.5rem', alignItems:'start' }}>
            <div style={{ background:'#1a1a1a', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', padding:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', marginBottom:'1rem' }}>
                <h2 style={{ margin:0, fontSize:'1.15rem' }}>Manage products</h2>
                <button onClick={loadProducts} style={{ padding:'0.6rem 1rem', background:'transparent', border:'1px solid rgba(255,255,255,0.15)', borderRadius:10, color:'white', cursor:'pointer' }}>Reload</button>
              </div>
              <p style={{ color:'rgba(255,255,255,0.5)', marginBottom:'1.25rem' }}>Submit a new product to the backend and review the list below.</p>
              {productsLoading ? (
                <div style={{ padding:'3rem 0', textAlign:'center', color:'rgba(255,255,255,0.4)' }}>Loading products...</div>
              ) : (
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                        {['Name','Category','Price','Stock','Status'].map(h => (
                          <th key={h} style={{ padding:'0.9rem 0.75rem', textAlign:'left', color:'rgba(255,255,255,0.45)', fontWeight:600, fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.7px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ padding:'1.5rem 0.75rem', color:'rgba(255,255,255,0.35)' }}>No products loaded yet.</td>
                        </tr>
                      ) : products.map((product) => (
                        <tr key={product._id || product.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding:'1rem 0.75rem', fontWeight:600 }}>{product.name}</td>
                          <td style={{ padding:'1rem 0.75rem', color:'rgba(255,255,255,0.55)' }}>{product.category}</td>
                          <td style={{ padding:'1rem 0.75rem', color:'#4ade80' }}>₦{Number(product.price).toLocaleString()}</td>
                          <td style={{ padding:'1rem 0.75rem' }}>{product.stock}</td>
                          <td style={{ padding:'1rem 0.75rem', color:'rgba(255,255,255,0.55)' }}>{product.stock > 0 ? 'Available' : 'Out of stock'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div style={{ background:'#1a1a1a', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', padding:'1.5rem' }}>
              <h2 style={{ margin:'0 0 1rem', fontSize:'1.15rem' }}>Add new product</h2>
              <form onSubmit={handleAddProduct} style={{ display:'grid', gap:'1rem' }}>
                {productError && (
                  <div style={{ background:'rgba(220,38,38,0.12)', color:'#fecaca', padding:'0.9rem 1rem', borderRadius:10, fontSize:'0.9rem' }}>
                    {productError}
                  </div>
                )}
                <label>
                  <span style={{ display:'block', marginBottom:'0.45rem', color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>Product name</span>
                  <input type="text" value={productForm.name} onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))} required style={inputStyle} />
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:'0.45rem', color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>Category</span>
                  <select value={productForm.category} onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))} style={inputStyle}>
                    <option value="polo">Polo</option>
                    <option value="cap">Cap</option>
                    <option value="bangle">Bangle</option>
                    <option value="accessory">Accessory</option>
                  </select>
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:'0.45rem', color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>Price</span>
                  <input type="number" min="0" step="0.01" value={productForm.price} onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))} required style={inputStyle} />
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:'0.45rem', color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>Stock</span>
                  <input type="number" min="0" value={productForm.stock} onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))} required style={inputStyle} />
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:'0.45rem', color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>Sizes (comma separated)</span>
                  <input type="text" value={productForm.sizes} onChange={(e) => setProductForm(prev => ({ ...prev, sizes: e.target.value }))} placeholder="S, M, L" style={inputStyle} />
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:'0.45rem', color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>Image URL</span>
                  <input type="text" value={productForm.imageUrl} onChange={(e) => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))} placeholder="https://..." style={inputStyle} />
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:'0.45rem', color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>Description</span>
                  <textarea value={productForm.description} onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))} rows="4" style={{ ...inputStyle, minHeight:'110px', resize:'vertical' }} />
                </label>
                <button type="submit" disabled={productActionLoading} style={{ padding:'0.95rem 1rem', borderRadius:12, border:'none', background: productActionLoading ? '#7f1d1d' : '#c41e3a', color:'white', fontWeight:700, cursor: productActionLoading ? 'not-allowed' : 'pointer' }}>
                  {productActionLoading ? 'Saving...' : 'Add product'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ADS */}
        {tab==='ads' && (
          <div style={{ display:'grid', gridTemplateColumns:'1.3fr 0.9fr', gap:'1.5rem', alignItems:'start' }}>
            <div style={{ background:'#1a1a1a', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', padding:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', marginBottom:'1rem' }}>
                <div>
                  <h2 style={{ margin:0, fontSize:'1.15rem' }}>Live ads</h2>
                  <p style={{ color:'rgba(255,255,255,0.45)', margin:0, fontSize:'0.9rem' }}>Create and preview store banners that keep the shop page fresh.</p>
                </div>
                <button onClick={loadAds} style={{ padding:'0.6rem 1rem', background:'transparent', border:'1px solid rgba(255,255,255,0.15)', borderRadius:10, color:'white', cursor:'pointer' }}>Reload ads</button>
              </div>
              {adsLoading ? (
                <div style={{ padding:'3rem 0', textAlign:'center', color:'rgba(255,255,255,0.4)' }}>Loading ads...</div>
              ) : ads.length === 0 ? (
                <div style={{ padding:'2.5rem', textAlign:'center', color:'rgba(255,255,255,0.35)' }}>
                  No active ads yet. Add one to run it on the shop page.
                </div>
              ) : (
                <div style={{ display:'grid', gap:'1rem' }}>
                  {ads.map((ad) => (
                    <div key={ad.id} style={{ padding:'1.2rem', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'0.75rem' }}>
                        <div style={{ width:52, height:52, borderRadius:14, overflow:'hidden', background:'#111' }}>
                          <img src={ad.imageUrl} alt={ad.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={(e) => { e.target.src = 'https://placehold.co/120x120/f0eded/999?text=Ad'; }} />
                        </div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:'1rem' }}>{ad.title}</div>
                          <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.5)' }}>{ad.category === 'all' ? 'All categories' : ad.category}</div>
                        </div>
                      </div>
                      <div style={{ color:'rgba(255,255,255,0.65)', marginBottom:'0.75rem' }}>{ad.message}</div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
                        <span style={{ color:'#c41e3a', fontWeight:700 }}>
                          {ad.ctaText || 'Shop now'}
                        </span>
                        <span style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.4)' }}>Ad ID {ad.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background:'#1a1a1a', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', padding:'1.5rem' }}>
              <h2 style={{ margin:'0 0 1rem', fontSize:'1.15rem' }}>Run new ad</h2>
              <form onSubmit={handleAddAd} style={{ display:'grid', gap:'1rem' }}>
                {adError && (
                  <div style={{ background:'rgba(220,38,38,0.12)', color:'#fecaca', padding:'0.9rem 1rem', borderRadius:10, fontSize:'0.9rem' }}>
                    {adError}
                  </div>
                )}
                <label>
                  <span style={{ display:'block', marginBottom:'0.45rem', color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>Ad title</span>
                  <input type="text" value={adForm.title} onChange={(e) => setAdForm(prev => ({ ...prev, title: e.target.value }))} required style={inputStyle} />
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:'0.45rem', color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>Message</span>
                  <textarea value={adForm.message} onChange={(e) => setAdForm(prev => ({ ...prev, message: e.target.value }))} rows="4" style={{ ...inputStyle, minHeight:'110px', resize:'vertical' }} required />
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:'0.45rem', color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>Call to action</span>
                  <input type="text" value={adForm.ctaText} onChange={(e) => setAdForm(prev => ({ ...prev, ctaText: e.target.value }))} style={inputStyle} />
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:'0.45rem', color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>Category</span>
                  <select value={adForm.category} onChange={(e) => setAdForm(prev => ({ ...prev, category: e.target.value }))} style={inputStyle}>
                    <option value="all">All products</option>
                    <option value="polo">Polo Shirts</option>
                    <option value="cap">Caps</option>
                    <option value="bangle">Bangles</option>
                    <option value="accessory">Accessories</option>
                  </select>
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:'0.45rem', color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>Ad image</span>
                  <input type="file" accept="image/*" onChange={(e) => setAdForm(prev => ({ ...prev, imageFile: e.target.files?.[0] || null }))} style={{ color: 'white' }} />
                  <small style={{ display:'block', marginTop:'0.5rem', color:'rgba(255,255,255,0.45)', fontSize:'0.8rem' }}>Choose a picture from your device. If none is selected, you can still paste an image URL below.</small>
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:'0.45rem', color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>Image URL (optional)</span>
                  <input type="text" value={adForm.imageUrl} onChange={(e) => setAdForm(prev => ({ ...prev, imageUrl: e.target.value }))} placeholder="https://..." style={inputStyle} />
                </label>
                <button type="submit" disabled={adActionLoading} style={{ padding:'0.95rem 1rem', borderRadius:12, border:'none', background: adActionLoading ? '#7f1d1d' : '#f97316', color:'white', fontWeight:700, cursor: adActionLoading ? 'not-allowed' : 'pointer' }}>
                  {adActionLoading ? 'Saving ad...' : 'Run ad campaign'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; }
        button:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}