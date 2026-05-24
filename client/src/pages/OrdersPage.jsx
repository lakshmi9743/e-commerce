import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiArrowRight } from 'react-icons/fi';
import api from '../services/api';
import './OrdersPage.css';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  if (orders.length === 0) return (
    <div className="page">
      <div className="container">
        <div className="empty-state">
          <FiPackage size={64} style={{color:'var(--accent)',opacity:0.4}} />
          <h3>No orders yet</h3>
          <p>Your order history will appear here.</p>
          <Link to="/products" className="btn btn-primary" style={{marginTop:'1.5rem'}} id="shop-now-btn">Start Shopping</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title" style={{marginBottom:'1.5rem'}}>My Orders</h1>
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card card">
              <div className="order-card__header">
                <div>
                  <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                  <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}</div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Progress Bar */}
              {order.status !== 'cancelled' && (
                <div className="order-progress">
                  {STATUS_STEPS.map((s, i) => {
                    const cur = STATUS_STEPS.indexOf(order.status);
                    return (
                      <div key={s} className={`progress-step ${i <= cur ? 'active' : ''}`}>
                        <div className="progress-dot" />
                        <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                        {i < STATUS_STEPS.length - 1 && <div className={`progress-line ${i < cur ? 'filled' : ''}`} />}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="order-items-preview">
                {order.items.slice(0, 3).map((item) => (
                  <img key={item._id} src={item.image} alt={item.name} className="order-item-thumb" title={item.name} />
                ))}
                {order.items.length > 3 && <div className="more-items">+{order.items.length - 3}</div>}
                <div className="order-items-info">
                  <span>{order.items.reduce((s, i) => s + i.quantity, 0)} item(s)</span>
                  <strong>${order.totalPrice.toFixed(2)}</strong>
                </div>
              </div>

              <div className="order-card__footer">
                {order.trackingNumber && <span className="tracking">📦 Tracking: {order.trackingNumber}</span>}
                <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm" id={`view-order-${order._id}`}>
                  View Details <FiArrowRight size={13}/>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
