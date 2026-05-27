import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';
import api from '../services/api';
import './OrderDetailPage.css';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!order) return null;

  const cur = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="page">
      <div className="container">
        <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate('/orders')} id="back-to-orders">
          <FiArrowLeft /> My Orders
        </button>

        <div className="od-header">
          <div>
            <h1 className="section-title" style={{ fontSize: '1.6rem' }}>
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="section-subtitle">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Progress Tracker */}
        {order.status !== 'cancelled' && (
          <div className="od-tracker card">
            <div className="tracker-steps">
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className={`tracker-step ${i <= cur ? 'active' : ''}`}>
                  <div className="tracker-icon">
                    {i <= cur ? '✓' : i + 1}
                  </div>
                  <div className="tracker-label">
                    <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                    {i === cur && <small>Current Status</small>}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`tracker-line ${i < cur ? 'filled' : ''}`} />
                  )}
                </div>
              ))}
            </div>
            {order.trackingNumber && (
              <p className="tracker-tracking">
                📦 Tracking Number: <strong>{order.trackingNumber}</strong>
              </p>
            )}
          </div>
        )}

        <div className="od-layout">
          {/* Items */}
          <div className="od-items card">
            <h2 className="od-section-title">Order Items ({order.items.length})</h2>
            {order.items.map((item) => (
              <div key={item._id} className="od-item">
                <img src={item.image} alt={item.name} className="od-item__image" />
                <div className="od-item__info">
                  <Link to={`/products/${item.product}`} className="od-item__name">{item.name}</Link>
                  <span className="od-item__meta">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</span>
                </div>
                <span className="od-item__total">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="divider" />
            <div className="od-price-breakdown">
              <div className="price-row"><span>Subtotal</span><span>₹{order.itemsPrice.toFixed(2)}</span></div>
              <div className="price-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice.toFixed(2)}`}</span></div>
              <div className="price-row"><span>Tax</span><span>₹{order.taxPrice.toFixed(2)}</span></div>
              <div className="price-row price-total"><span>Total</span><span>₹{order.totalPrice.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Right side */}
          <div className="od-sidebar">
            <div className="od-info-card card">
              <h3 className="od-section-title">Shipping Address</h3>
              <p className="od-address">
                <strong>{order.shippingAddress.fullName}</strong><br />
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}<br />
                📞 {order.shippingAddress.phone}
              </p>
            </div>

            <div className="od-info-card card">
              <h3 className="od-section-title">Payment</h3>
              <p className="od-payment">
                <span className="od-label">Method:</span> {order.paymentMethod}<br />
                <span className="od-label">Status:</span>{' '}
                <span style={{ color: order.isPaid ? 'var(--success)' : 'var(--warning)' }}>
                  {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Pending'}
                </span>
              </p>
            </div>

            {order.status === 'cancelled' && (
              <div className="alert alert-error" style={{ marginTop: 0 }}>
                This order has been cancelled.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
