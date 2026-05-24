import { useState, useEffect } from 'react';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const CATEGORIES = ['Electronics','Clothing','Books','Home & Garden','Sports','Beauty','Toys','Food','Other'];
const STATUS_OPTIONS = ['pending','processing','shipped','delivered','cancelled'];

const emptyProduct = { name:'', description:'', price:'', category:'Electronics', image:'', stock:'', brand:'', featured:false };

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'add' | 'edit'
  const [form, setForm] = useState(emptyProduct);
  const [editId, setEditId] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, p, o] = await Promise.all([
        api.get('/orders/stats'),
        api.get('/products?limit=100'),
        api.get('/orders?limit=50'),
      ]);
      setStats(s.data);
      setProducts(p.data.products);
      setOrders(o.data.orders);
    } catch (e) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  // --- Product CRUD ---
  const openAdd  = () => { setForm(emptyProduct); setModal('add'); };
  const openEdit = (p)  => { setForm({ ...p, price: p.price.toString(), stock: p.stock.toString() }); setEditId(p._id); setModal('edit'); };

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (modal === 'add') {
        const { data } = await api.post('/products', payload);
        setProducts(p => [data.product, ...p]);
        toast.success('Product created!');
      } else {
        const { data } = await api.put(`/products/${editId}`, payload);
        setProducts(p => p.map(x => x._id === editId ? data.product : x));
        toast.success('Product updated!');
      }
      setModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving product'); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(p => p.filter(x => x._id !== id));
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete'); }
  };

  // --- Order status update ---
  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders(o => o.map(x => x._id === orderId ? { ...x, status } : x));
      toast.success('Status updated!');
    } catch { toast.error('Failed to update status'); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  const statCards = [
    { label: 'Total Revenue',  value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, icon: <FiDollarSign />, color: 'var(--success)' },
    { label: 'Total Orders',   value: stats?.totalOrders || 0,                     icon: <FiPackage />,    color: 'var(--accent-light)' },
    { label: 'Products',       value: products.length,                             icon: <FiShoppingBag />,color: 'var(--gold)' },
    { label: 'Customers',      value: '—',                                         icon: <FiUsers />,      color: 'var(--info)' },
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="section-title">Admin Dashboard</h1>
            <p className="section-subtitle">Manage your store</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {['overview','products','orders'].map(t => (
            <button key={t} id={`tab-${t}`} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="admin-overview fade-up">
            <div className="stats-grid">
              {statCards.map((s, i) => (
                <div key={i} className="stat-card card">
                  <div className="stat-card__icon" style={{ background: `${s.color}22`, color: s.color }}>{s.icon}</div>
                  <div>
                    <div className="stat-card__value">{s.value}</div>
                    <div className="stat-card__label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="overview-grid">
              <div className="card recent-orders-preview">
                <h3 className="od-section-title">Recent Orders</h3>
                {orders.slice(0, 5).map(o => (
                  <div key={o._id} className="mini-order-row">
                    <span className="mono">#{o._id.slice(-6).toUpperCase()}</span>
                    <span>{o.user?.name}</span>
                    <span>${o.totalPrice.toFixed(2)}</span>
                    <span className={`badge badge-${o.status}`}>{o.status}</span>
                  </div>
                ))}
              </div>
              <div className="card status-breakdown">
                <h3 className="od-section-title">Order Status Breakdown</h3>
                {(stats?.statusCounts || []).map(s => (
                  <div key={s._id} className="status-row">
                    <span className={`badge badge-${s._id}`}>{s._id}</span>
                    <div className="status-bar-wrap">
                      <div className="status-bar" style={{ width: `${Math.min((s.count / (stats.totalOrders || 1)) * 100, 100)}%` }} />
                    </div>
                    <span className="status-count">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {tab === 'products' && (
          <div className="fade-up">
            <div className="admin-section-header">
              <span>{products.length} products</span>
              <button className="btn btn-primary btn-sm" id="add-product-btn" onClick={openAdd}>
                <FiPlus /> Add Product
              </button>
            </div>
            <div className="admin-table-wrap card">
              <table className="admin-table">
                <thead>
                  <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td><img src={p.image} alt={p.name} className="table-img" /></td>
                      <td className="product-name-cell">{p.name}</td>
                      <td><span className="badge badge-processing">{p.category}</span></td>
                      <td className="bold">${p.price.toFixed(2)}</td>
                      <td><span style={{ color: p.stock < 5 ? 'var(--danger)' : 'var(--success)' }}>{p.stock}</span></td>
                      <td>⭐ {p.rating.toFixed(1)}</td>
                      <td>
                        <div style={{ display:'flex', gap:'0.4rem' }}>
                          <button className="btn btn-ghost btn-sm" id={`edit-${p._id}`} onClick={() => openEdit(p)}><FiEdit2 /></button>
                          <button className="btn btn-danger btn-sm" id={`delete-${p._id}`} onClick={() => deleteProduct(p._id)}><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {tab === 'orders' && (
          <div className="fade-up">
            <div className="admin-section-header"><span>{orders.length} orders</span></div>
            <div className="admin-table-wrap card">
              <table className="admin-table">
                <thead>
                  <tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Update</th></tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td className="mono">#{o._id.slice(-8).toUpperCase()}</td>
                      <td>{o.user?.name}<br/><small style={{color:'var(--text-muted)'}}>{o.user?.email}</small></td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="bold">${o.totalPrice.toFixed(2)}</td>
                      <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                      <td>
                        <select
                          id={`status-${o._id}`}
                          className="form-input status-select"
                          value={o.status}
                          onChange={e => updateStatus(o._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box card" onClick={e => e.stopPropagation()} id="product-modal">
            <div className="modal-header">
              <h2>{modal === 'add' ? 'Add Product' : 'Edit Product'}</h2>
              <button onClick={() => setModal(null)} id="close-modal-btn"><FiX /></button>
            </div>
            <form onSubmit={saveProduct} className="modal-form">
              <div className="form-row-2">
                <div className="form-group"><label className="form-label">Name</label><input id="prod-name" className="form-input" value={form.name} onChange={e=>set('name',e.target.value)} required /></div>
                <div className="form-group"><label className="form-label">Brand</label><input id="prod-brand" className="form-input" value={form.brand} onChange={e=>set('brand',e.target.value)} /></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea id="prod-desc" className="form-input" rows={2} value={form.description} onChange={e=>set('description',e.target.value)} required /></div>
              <div className="form-row-3">
                <div className="form-group"><label className="form-label">Price ($)</label><input id="prod-price" type="number" step="0.01" min="0" className="form-input" value={form.price} onChange={e=>set('price',e.target.value)} required /></div>
                <div className="form-group"><label className="form-label">Stock</label><input id="prod-stock" type="number" min="0" className="form-input" value={form.stock} onChange={e=>set('stock',e.target.value)} required /></div>
                <div className="form-group"><label className="form-label">Category</label>
                  <select id="prod-category" className="form-input" value={form.category} onChange={e=>set('category',e.target.value)}>
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Image URL</label><input id="prod-image" className="form-input" value={form.image} onChange={e=>set('image',e.target.value)} placeholder="https://..." /></div>
              <label className="featured-toggle">
                <input id="prod-featured" type="checkbox" checked={form.featured} onChange={e=>set('featured',e.target.checked)} />
                <span>Mark as Featured</span>
              </label>
              <div style={{display:'flex',gap:'0.75rem',marginTop:'0.5rem'}}>
                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" id="save-product-btn" className="btn btn-primary" style={{flex:1}}>
                  <FiCheck /> {modal === 'add' ? 'Create Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
