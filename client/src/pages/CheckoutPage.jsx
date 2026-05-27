import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLock } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '', address: '', city: '', postalCode: '', country: '', phone: '',
    paymentMethod: 'Credit Card',
  });

  const shipping  = total > 5000 ? 0 : 499;
  const tax       = parseFloat((total * 0.08).toFixed(2));
  const grandTotal= parseFloat((total + shipping + tax).toFixed(2));

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const nextStep = (e) => {
    e.preventDefault();
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map(i => ({ product: i._id, name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
        shippingAddress: { fullName: form.fullName, address: form.address, city: form.city, postalCode: form.postalCode, country: form.country, phone: form.phone },
        paymentMethod: form.paymentMethod,
      };
      const { data } = await api.post('/orders', orderData);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title" style={{marginBottom:'0.5rem'}}>Checkout</h1>

        {/* Stepper */}
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={s} className={`step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-circle">{i < step ? '✓' : i + 1}</div>
              <span>{s}</span>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-form card">
            {/* Step 0 - Shipping */}
            {step === 0 && (
              <form onSubmit={nextStep} id="shipping-form">
                <h2 className="form-section-title">Shipping Address</h2>
                {[
                  ['fullName','Full Name','text','John Doe'],
                  ['address','Street Address','text','123 Main Street'],
                  ['city','City','text','New York'],
                  ['postalCode','Postal Code','text','10001'],
                  ['country','Country','text','United States'],
                  ['phone','Phone Number','tel','+1 555 000 0000'],
                ].map(([key, label, type, ph]) => (
                  <div className="form-group" key={key}>
                    <label className="form-label">{label}</label>
                    <input id={`field-${key}`} type={type} className="form-input" placeholder={ph} value={form[key]} onChange={e => set(key, e.target.value)} required />
                  </div>
                ))}
                <button type="submit" id="next-payment-btn" className="btn btn-primary btn-lg btn-full">
                  Continue to Payment <FiArrowRight />
                </button>
              </form>
            )}

            {/* Step 1 - Payment */}
            {step === 1 && (
              <form onSubmit={nextStep} id="payment-form">
                <h2 className="form-section-title">Payment Method</h2>
                {['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery'].map(m => (
                  <label key={m} className={`payment-option ${form.paymentMethod === m ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value={m} checked={form.paymentMethod === m} onChange={() => set('paymentMethod', m)} id={`pay-${m.replace(/ /g,'-')}`} />
                    <span>{m}</span>
                  </label>
                ))}
                {(form.paymentMethod === 'Credit Card' || form.paymentMethod === 'Debit Card') && (
                  <div className="mock-card-fields">
                    <div className="form-group"><label className="form-label">Card Number</label><input className="form-input" placeholder="4242 4242 4242 4242" id="card-number" /></div>
                    <div className="card-row">
                      <div className="form-group"><label className="form-label">Expiry</label><input className="form-input" placeholder="MM/YY" id="card-expiry" /></div>
                      <div className="form-group"><label className="form-label">CVV</label><input className="form-input" placeholder="123" id="card-cvv" /></div>
                    </div>
                    <p className="mock-note"><FiLock size={12}/> This is a demo — no real charges</p>
                  </div>
                )}
                <div style={{display:'flex',gap:'0.75rem',marginTop:'1rem'}}>
                  <button type="button" className="btn btn-ghost btn-lg" onClick={() => setStep(0)} id="back-to-shipping">← Back</button>
                  <button type="submit" id="next-review-btn" className="btn btn-primary btn-lg" style={{flex:1}}>Review Order <FiArrowRight /></button>
                </div>
              </form>
            )}

            {/* Step 2 - Review */}
            {step === 2 && (
              <div id="order-review">
                <h2 className="form-section-title">Review Your Order</h2>
                <div className="review-items">
                  {items.map(i => (
                    <div key={i._id} className="review-item">
                      <img src={i.image} alt={i.name} />
                      <div><div className="ri-name">{i.name}</div><div className="ri-meta">x{i.quantity}</div></div>
                      <span className="ri-price">₹{(i.price * i.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="divider" />
                <div className="review-address">
                  <strong>Ship to:</strong> {form.fullName}, {form.address}, {form.city} {form.postalCode}, {form.country}
                </div>
                <div className="review-payment"><strong>Payment:</strong> {form.paymentMethod}</div>
                <div style={{display:'flex',gap:'0.75rem',marginTop:'1.5rem'}}>
                  <button type="button" className="btn btn-ghost btn-lg" onClick={() => setStep(1)} id="back-to-payment">← Back</button>
                  <button id="place-order-btn" className="btn btn-primary btn-lg" style={{flex:1}} onClick={placeOrder} disabled={loading}>
                    {loading ? 'Placing Order...' : `Place Order — ₹${grandTotal}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="checkout-summary card">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {items.map(i => (
                <div key={i._id} className="s-item">
                  <span>{i.name} ×{i.quantity}</span>
                  <span>₹{(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div className="s-item"><span>Subtotal</span><span>₹{total.toFixed(2)}</span></div>
            <div className="s-item"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            <div className="s-item"><span>Tax</span><span>₹{tax}</span></div>
            <div className="divider" />
            <div className="s-item s-total"><span>Total</span><span>₹{grandTotal}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
