import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

export default function CartPage() {
  const { items, removeFromCart, updateQty, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = total > 5000 ? 0 : 499;
  const tax      = parseFloat((total * 0.08).toFixed(2));
  const grandTotal = parseFloat((total + shipping + tax).toFixed(2));

  if (items.length === 0) return (
    <div className="page">
      <div className="container">
        <div className="empty-state">
          <FiShoppingBag size={64} style={{color:'var(--accent)',opacity:0.4}} />
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary" style={{marginTop:'1.5rem'}} id="browse-products-btn">
            Browse Products <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="container">
        <div className="cart-header">
          <h1 className="section-title">Shopping Cart</h1>
          <button className="btn btn-ghost btn-sm" onClick={clearCart} id="clear-cart-btn">Clear All</button>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map((item) => (
              <div key={item._id} className="cart-item card">
                <img src={item.image} alt={item.name} className="cart-item__image" />
                <div className="cart-item__info">
                  <Link to={`/products/${item._id}`} className="cart-item__name">{item.name}</Link>
                  <span className="cart-item__category">{item.category}</span>
                  <span className="cart-item__price">₹{item.price.toFixed(2)}</span>
                </div>
                <div className="cart-item__controls">
                  <button id={`dec-${item._id}`} onClick={() => updateQty(item._id, item.quantity - 1)} disabled={item.quantity <= 1}><FiMinus /></button>
                  <span className="cart-item__qty">{item.quantity}</span>
                  <button id={`inc-${item._id}`} onClick={() => updateQty(item._id, item.quantity + 1)} disabled={item.quantity >= item.stock}><FiPlus /></button>
                </div>
                <div className="cart-item__subtotal">₹{(item.price * item.quantity).toFixed(2)}</div>
                <button className="cart-item__remove" id={`remove-${item._id}`} onClick={() => removeFromCart(item._id)}><FiTrash2 /></button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary card">
            <h2 className="cart-summary__title">Order Summary</h2>
            <div className="summary-row"><span>Subtotal ({items.reduce((s,i) => s+i.quantity, 0)} items)</span><span>₹{total.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="free-ship">FREE</span> : `₹${shipping.toFixed(2)}`}</span></div>
            {shipping > 0 && <p className="free-ship-hint">Add ₹{(5000 - total).toFixed(2)} more for free shipping</p>}
            <div className="summary-row"><span>Tax (8%)</span><span>₹{tax}</span></div>
            <div className="divider" />
            <div className="summary-row summary-total"><span>Total</span><span>₹{grandTotal}</span></div>

            {user ? (
              <button className="btn btn-primary btn-lg btn-full" id="checkout-btn" onClick={() => navigate('/checkout')}>
                Proceed to Checkout <FiArrowRight />
              </button>
            ) : (
              <Link to="/login" className="btn btn-primary btn-lg btn-full" id="login-to-checkout-btn">
                Login to Checkout <FiArrowRight />
              </Link>
            )}
            <Link to="/products" className="btn btn-ghost btn-full" style={{marginTop:'0.5rem'}} id="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
