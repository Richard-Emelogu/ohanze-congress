import React, { useEffect, useState, useCallback } from 'react';
import './Dashboard.css';
import { API_URL } from '../utils/apiUrl';

const token = () => localStorage.getItem('token');
const headers = () => ({ 'Content-Type': 'application/json', 'x-auth-token': token() });
const authHeaders = () => ({ 'x-auth-token': token() });

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

  const inp = {
    width: '100%', borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.12)',
    background: '#111', color: 'white',
    padding: '0.8rem 1rem', fontSize: '0.9rem', outline: 'none',
    fontFamily: 'Inter, sans-serif',
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };
  const logout = () => { localStorage.removeItem('token'); window.location.href = '/admin/login'; };

  useEffect(() => {
    if (!token()) { window.location.href = '/admin/login'; return; }
    fetch(`${API_URL}/auth/me`, { headers: headers() })
      .then(r => r.json()).then(d => setUser(d.user || d)).catch(logout);
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
      .then(async r => { const d = await r.json(); setProducts(Array.isArray(d) ? d : d.products || []); })
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false));
  }, []);

  const loadAds = useCallback(() => {
    setAdsLoading(true);
    fetch(`${API_URL}/ads`)
      .then(async r => { const d = await r.json(); setAds(Array.isArray(d) ? d : d.ads || []); })
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
      method: 'PUT', headers: headers(), body: JSON.stringify({ action })
    });
    showToast(action === 'approve' ? 'Admin approved!' : 'Admin declined.');
    loadPending();
  };

  const handleAddProduct = async (e) => {
    e.preventDefault(); setProductError(''); setProductActionLoading(true);
    try {
      const payload = {
        name: productForm.name.trim(), category: productForm.category,
        price: Number(productForm.price), stock: Number(productForm.stock),
        description: productForm.description.trim(),
        imageUrl: productForm.imageUrl.trim() || undefined,
        sizes: productForm.sizes.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch(`${API_URL}/products`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to add product.');
      setProductForm({ name: '', category: 'polo', price: '', stock: '', description: '', imageUrl: '', sizes: 'S, M, L' });
      showToast('Product added successfully!');
      loadProducts();
    } catch (err) { setProductError(err.message); }
    finally { setProductActionLoading(false); }
  };

  const handleAddAd = async (e) => {
    e.preventDefault(); setAdError(''); setAdActionLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', adForm.title.trim());
      fd.append('message', adForm.message.trim());
      fd.append('ctaText', adForm.ctaText.trim() || 'Shop now');
      fd.append('category', adForm.category);
      if (adForm.imageFile) fd.append('image', adForm.imageFile);
      else if (adForm.imageUrl.trim()) fd.append('imageUrl', adForm.imageUrl.trim());
      const res = await fetch(`${API_URL}/ads`, { method: 'POST', headers: authHeaders(), body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to add ad.');
      setAdForm({ title: '', message: '', ctaText: 'Shop now', imageUrl: '', imageFile: null, category: 'all' });
      showToast('Ad published!');
      loadAds();
    } catch (err) { setAdError(err.message); }
    finally { setAdActionLoading(false); }
  };

  if (!user) return (
    <div style={{ minHeight:'100vh', background:'#0d0d0d', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontFamily:'Inter,sans-serif' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:40, height:40, border:'3px solid rgba(196,30,58,0.3)', borderTopColor:'#c41e3a', borderRadius:'50%', animation:'spin 0.7s linear infinite', margin:'0 auto 1rem' }} />
        Loading...
      </div>
    </div>
  );

  const tabs = [
    { id:'overview',  label:'Overview',  icon:'📊' },
    { id:'orders',    label:'Orders',    icon:'📦' },
    { id:'approvals', label:'Approvals', icon:'👥', badge: pending.length },
    { id:'products',  label:'Products',  icon:'🛍️' },
    { id:'ads',       label:'Ads',       icon:'📣' },
  ];

  const card = { background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'1.5rem' };

  return (
    <div className="dashboard-page">

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:24, right:24, zIndex:9999, background:'#1a1a1a', border:'1px solid rgba(196,30,58,0.4)', color:'white', padding:'0.875rem 1.5rem', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,0.5)', fontSize:'0.9rem', animation:'fadeUp 0.3s ease' }}>
          {toast}
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <div className="dashboard-sidebar">
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'2.5rem', padding:'0 0.5rem' }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#c41e3a,#7a0a0a)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6l-9-4z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:'0.85rem' }}>August 93 Club</div>
            <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', letterSpacing:1 }}>ADMIN PANEL</div>
          </div>
        </div>

        <nav className="dashboard-nav">
          {tabs.map(t => (
            <button key={t.id} className={t.id === tab ? 'active' : ''} onClick={() => setTab(t.id)}>
              <span style={{ fontSize:'1.1rem' }}>{t.icon}</span>
              {t.label}
              {t.badge > 0 && <span className="badge">{t.badge}</span>}
            </button>
          ))}
        </nav>

        <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:'1rem', marginTop:'auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'0.75rem' }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#c41e3a,#7a0a0a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', fontWeight:700 }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:'0.82rem', fontWeight:600 }}>{user.name}</div>
              <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)' }}>{user.role}</div>
            </div>
          </div>
          <button onClick={logout} style={{ width:'100%', padding:'0.6rem', borderRadius:8, border:'1px solid rgba(196,30,58,0.3)', background:'transparent', color:'#f87171', fontSize:'0.82rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
            Sign out
          </button>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="dashboard-mobile-nav">
        {tabs.map(t => (
          <button key={t.id} className={t.id === tab ? 'active' : ''} onClick={() => setTab(t.id)}>
            {t.badge > 0 && <span className="mob-badge">{t.badge}</span>}
            <span className="mob-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
        <button onClick={logout} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'0.5rem 0.25rem', background:'transparent', border:'none', color:'#f87171', fontSize:'0.6rem', fontFamily:'Inter,sans-serif', cursor:'pointer' }}>
          <span style={{ fontSize:'1.2rem' }}>🚪</span>
          Sign out
        </button>
      </div>

      {/* MAIN */}
      <div className="dashboard-main">

        {/* Desktop topbar */}
        <div className="dashboard-topbar">
          <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#c41e3a,#7a0a0a)', display:'grid', placeItems:'center', color:'white', fontWeight:700, fontSize:'1.1rem' }}>A</div>
            <div>
              <div style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.65)' }}>Admin Navigation</div>
              <div style={{ fontSize:'1.2rem', fontWeight:700 }}>Dashboard Control</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:'0.75rem 1rem', borderRadius:12, border:'1px solid rgba(255,255,255,0.1)', background: tab===t.id ? 'rgba(196,30,58,0.2)' : 'transparent', color: tab===t.id ? '#fca5a5' : 'rgba(255,255,255,0.75)', cursor:'pointer', fontWeight:600, fontSize:'0.85rem', fontFamily:'Inter,sans-serif' }}>
                {t.label}
              </button>
            ))}
            <button onClick={logout} style={{ padding:'0.75rem 1rem', borderRadius:12, border:'1px solid rgba(196,30,58,0.4)', background:'rgba(196,30,58,0.16)', color:'#f87171', cursor:'pointer', fontWeight:700, fontSize:'0.85rem', fontFamily:'Inter,sans-serif' }}>
              Sign out
            </button>
          </div>
        </div>

        {/* Page title */}
        <div style={{ marginBottom:'1.5rem' }}>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-0.5px' }}>
            {tabs.find(t=>t.id===tab)?.icon} {tabs.find(t=>t.id===tab)?.label}
          </h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.82rem', marginTop:4 }}>
            {new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
          </p>
        </div>

        {/* OVERVIEW */}
        {tab==='overview' && (
          <div>
            <div className="stats-grid">
              {[
                { label:'Total Orders', value: stats?.totalOrders ?? 0, icon:'📦', color:'#c41e3a' },
                { label:'Pending', value: stats?.pendingOrders ?? 0, icon:'⏳', color:'#d97706' },
                { label:'Completed', value: stats?.completedOrders ?? 0, icon:'✅', color:'#16a34a' },
                { label:'Revenue', value: `₦${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon:'💰', color:'#7c3aed' },
              ].map((s,i) => (
                <div key={i} className="stat-card">
                  <div style={{ fontSize:'1.4rem', marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:'1.4rem', fontWeight:800, color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.45)', marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {pending.length > 0 && (
              <div style={{ background:'rgba(196,30,58,0.1)', border:'1px solid rgba(196,30,58,0.3)', borderRadius:12, padding:'1rem 1.25rem', cursor:'pointer', fontSize:'0.9rem' }} onClick={() => setTab('approvals')}>
                🔔 <strong>{pending.length} pending admin request{pending.length>1?'s':''}</strong> — tap to review
              </div>
            )}
          </div>
        )}

        {/* ORDERS */}
        {tab==='orders' && (
          <div className="orders-table-wrap">
            {orders.length === 0 ? (
              <div style={{ padding:'3rem', textAlign:'center', color:'rgba(255,255,255,0.3)' }}>No orders yet</div>
            ) : (
              <table>
                <thead>
                  <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                    {['Customer','Email','Amount','Status','Date'].map(h => (
                      <th key={h} style={{ padding:'1rem', textAlign:'left', color:'rgba(255,255,255,0.4)', fontWeight:600, fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:0.8 }}>{h}</th>
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
                        <span style={{ padding:'3px 10px', borderRadius:20, fontSize:'0.72rem', fontWeight:600, background: o.status==='completed' ? 'rgba(22,163,74,0.2)' : 'rgba(217,119,6,0.2)', color: o.status==='completed' ? '#4ade80' : '#fbbf24' }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding:'1rem', color:'rgba(255,255,255,0.4)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
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
              <div style={{ ...card, textAlign:'center', color:'rgba(255,255,255,0.3)' }}>No pending requests</div>
            ) : pending.map((u,i) => (
              <div key={i} style={{ ...card, marginBottom:'1rem', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#c41e3a,#7a0a0a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', fontWeight:700, flexShrink:0 }}>
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight:700, marginBottom:2 }}>{u.name}</div>
                    <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.45)' }}>{u.email}</div>
                    {u.reason && <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.3)', marginTop:4 }}>"{u.reason}"</div>}
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  <button onClick={() => handleApproval(u._id, 'approve')} style={{ padding:'0.55rem 1.25rem', borderRadius:8, border:'none', background:'linear-gradient(135deg,#16a34a,#14532d)', color:'white', fontWeight:600, fontSize:'0.82rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                    Approve
                  </button>
                  <button onClick={() => handleApproval(u._id, 'decline')} style={{ padding:'0.55rem 1.25rem', borderRadius:8, border:'1px solid rgba(196,30,58,0.4)', background:'transparent', color:'#f87171', fontWeight:600, fontSize:'0.82rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCTS */}
        {tab==='products' && (
          <div className="dashboard-two-col">
            <div style={card}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
                <h2 style={{ margin:0, fontSize:'1.1rem' }}>Products</h2>
                <button onClick={loadProducts} style={{ padding:'0.5rem 1rem', background:'transparent', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, color:'white', cursor:'pointer', fontSize:'0.82rem', fontFamily:'Inter,sans-serif' }}>Reload</button>
              </div>
              {productsLoading ? (
                <div style={{ padding:'2rem 0', textAlign:'center', color:'rgba(255,255,255,0.4)' }}>Loading...</div>
              ) : (
                <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem', minWidth:400 }}>
                    <thead>
                      <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                        {['Name','Category','Price','Stock'].map(h => (
                          <th key={h} style={{ padding:'0.8rem 0.75rem', textAlign:'left', color:'rgba(255,255,255,0.45)', fontWeight:600, fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.7px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 ? (
                        <tr><td colSpan="4" style={{ padding:'1.5rem 0.75rem', color:'rgba(255,255,255,0.35)' }}>No products yet.</td></tr>
                      ) : products.map(p => (
                        <tr key={p._id || p.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding:'0.9rem 0.75rem', fontWeight:600 }}>{p.name}</td>
                          <td style={{ padding:'0.9rem 0.75rem', color:'rgba(255,255,255,0.55)' }}>{p.category}</td>
                          <td style={{ padding:'0.9rem 0.75rem', color:'#4ade80' }}>₦{Number(p.price).toLocaleString()}</td>
                          <td style={{ padding:'0.9rem 0.75rem' }}>{p.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div style={card}>
              <h2 style={{ margin:'0 0 1rem', fontSize:'1.1rem' }}>Add product</h2>
              <form onSubmit={handleAddProduct} style={{ display:'grid', gap:'0.875rem' }}>
                {productError && <div style={{ background:'rgba(220,38,38,0.12)', color:'#fecaca', padding:'0.8rem 1rem', borderRadius:10, fontSize:'0.85rem' }}>{productError}</div>}
                {[
                  { label:'Product name', key:'name', type:'text' },
                  { label:'Price (₦)', key:'price', type:'number' },
                  { label:'Stock', key:'stock', type:'number' },
                  { label:'Sizes (comma separated)', key:'sizes', type:'text' },
                  { label:'Image URL', key:'imageUrl', type:'text' },
                ].map(f => (
                  <label key={f.key}>
                    <span style={{ display:'block', marginBottom:5, color:'rgba(255,255,255,0.7)', fontSize:'0.85rem' }}>{f.label}</span>
                    <input type={f.type} value={productForm[f.key]} onChange={e => setProductForm(p => ({ ...p, [f.key]: e.target.value }))} required={f.key !== 'imageUrl'} style={inp} />
                  </label>
                ))}
                <label>
                  <span style={{ display:'block', marginBottom:5, color:'rgba(255,255,255,0.7)', fontSize:'0.85rem' }}>Category</span>
                  <select value={productForm.category} onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))} style={inp}>
                    <option value="polo">Polo</option>
                    <option value="cap">Cap</option>
                    <option value="bangle">Bangle</option>
                    <option value="accessory">Accessory</option>
                  </select>
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:5, color:'rgba(255,255,255,0.7)', fontSize:'0.85rem' }}>Description</span>
                  <textarea value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} rows="3" style={{ ...inp, minHeight:90, resize:'vertical' }} />
                </label>
                <button type="submit" disabled={productActionLoading} style={{ padding:'0.9rem', borderRadius:10, border:'none', background: productActionLoading ? '#7f1d1d' : '#c41e3a', color:'white', fontWeight:700, cursor: productActionLoading ? 'not-allowed' : 'pointer', fontFamily:'Inter,sans-serif' }}>
                  {productActionLoading ? 'Saving...' : 'Add product'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ADS */}
        {tab==='ads' && (
          <div className="dashboard-two-col-ads">
            <div style={card}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
                <div>
                  <h2 style={{ margin:0, fontSize:'1.1rem' }}>Live ads</h2>
                  <p style={{ color:'rgba(255,255,255,0.45)', margin:'4px 0 0', fontSize:'0.85rem' }}>Store banners visible to customers.</p>
                </div>
                <button onClick={loadAds} style={{ padding:'0.5rem 1rem', background:'transparent', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, color:'white', cursor:'pointer', fontSize:'0.82rem', fontFamily:'Inter,sans-serif' }}>Reload</button>
              </div>
              {adsLoading ? (
                <div style={{ padding:'2rem 0', textAlign:'center', color:'rgba(255,255,255,0.4)' }}>Loading...</div>
              ) : ads.length === 0 ? (
                <div style={{ padding:'2rem', textAlign:'center', color:'rgba(255,255,255,0.35)' }}>No active ads yet.</div>
              ) : ads.map(ad => (
                <div key={ad.id} style={{ padding:'1.2rem', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', marginBottom:'1rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'0.75rem' }}>
                    <div style={{ width:52, height:52, borderRadius:12, overflow:'hidden', background:'#111', flexShrink:0 }}>
                      <img src={ad.imageUrl} alt={ad.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => { e.target.src='https://placehold.co/120x120/1a1a1a/555?text=Ad'; }} />
                    </div>
                    <div>
                      <div style={{ fontWeight:700 }}>{ad.title}</div>
                      <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.45)' }}>{ad.category === 'all' ? 'All categories' : ad.category}</div>
                    </div>
                  </div>
                  <div style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.88rem', marginBottom:'0.75rem' }}>{ad.message}</div>
                  <span style={{ color:'#c41e3a', fontWeight:700, fontSize:'0.85rem' }}>{ad.ctaText || 'Shop now'}</span>
                </div>
              ))}
            </div>

            <div style={card}>
              <h2 style={{ margin:'0 0 1rem', fontSize:'1.1rem' }}>Run new ad</h2>
              <form onSubmit={handleAddAd} style={{ display:'grid', gap:'0.875rem' }}>
                {adError && <div style={{ background:'rgba(220,38,38,0.12)', color:'#fecaca', padding:'0.8rem 1rem', borderRadius:10, fontSize:'0.85rem' }}>{adError}</div>}
                <label>
                  <span style={{ display:'block', marginBottom:5, color:'rgba(255,255,255,0.7)', fontSize:'0.85rem' }}>Ad title</span>
                  <input type="text" value={adForm.title} onChange={e => setAdForm(p => ({ ...p, title: e.target.value }))} required style={inp} />
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:5, color:'rgba(255,255,255,0.7)', fontSize:'0.85rem' }}>Message</span>
                  <textarea value={adForm.message} onChange={e => setAdForm(p => ({ ...p, message: e.target.value }))} rows="3" style={{ ...inp, minHeight:90, resize:'vertical' }} required />
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:5, color:'rgba(255,255,255,0.7)', fontSize:'0.85rem' }}>Call to action</span>
                  <input type="text" value={adForm.ctaText} onChange={e => setAdForm(p => ({ ...p, ctaText: e.target.value }))} style={inp} />
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:5, color:'rgba(255,255,255,0.7)', fontSize:'0.85rem' }}>Category</span>
                  <select value={adForm.category} onChange={e => setAdForm(p => ({ ...p, category: e.target.value }))} style={inp}>
                    <option value="all">All products</option>
                    <option value="polo">Polo Shirts</option>
                    <option value="cap">Caps</option>
                    <option value="bangle">Bangles</option>
                    <option value="accessory">Accessories</option>
                  </select>
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:5, color:'rgba(255,255,255,0.7)', fontSize:'0.85rem' }}>Ad image</span>
                  <input type="file" accept="image/*" onChange={e => setAdForm(p => ({ ...p, imageFile: e.target.files?.[0] || null }))} style={{ color:'white', fontFamily:'Inter,sans-serif' }} />
                  <small style={{ display:'block', marginTop:4, color:'rgba(255,255,255,0.4)', fontSize:'0.78rem' }}>Or paste an image URL below.</small>
                </label>
                <label>
                  <span style={{ display:'block', marginBottom:5, color:'rgba(255,255,255,0.7)', fontSize:'0.85rem' }}>Image URL (optional)</span>
                  <input type="text" value={adForm.imageUrl} onChange={e => setAdForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." style={inp} />
                </label>
                <button type="submit" disabled={adActionLoading} style={{ padding:'0.9rem', borderRadius:10, border:'none', background: adActionLoading ? '#7c2d12' : '#f97316', color:'white', fontWeight:700, cursor: adActionLoading ? 'not-allowed' : 'pointer', fontFamily:'Inter,sans-serif' }}>
                  {adActionLoading ? 'Saving...' : 'Run ad campaign'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        button:hover { opacity: 0.92; }
      `}</style>
    </div>
  );
}