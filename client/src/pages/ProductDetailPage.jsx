import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiArrowLeft, FiPackage, FiTruck, FiShield } from 'react-icons/fi';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetailPage.css';

const Stars = ({ rating, size = 16 }) => (
  <div className="stars">
    {[1,2,3,4,5].map((s) => (
      <FiStar key={s} size={size}
        className={s <= Math.round(rating) ? 'star-filled' : 'star-empty'}
        fill={s <= Math.round(rating) ? 'currentColor' : 'none'} />
    ))}
  </div>
);

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => addToCart(product, qty);

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${id}/reviews`, review);
      setReviewMsg('Review submitted!');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;
  if (!product) return null;

  return (
    <div className="page">
      <div className="container">
        <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate(-1)} id="back-btn">
          <FiArrowLeft /> Back
        </button>

        <div className="product-detail">
          {/* Image */}
          <div className="product-detail__image-wrap">
            <img src={product.image} alt={product.name} className="product-detail__image" />
            {product.stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            <span className="product-card__category">{product.category}</span>
            <h1 className="product-detail__name">{product.name}</h1>
            <div className="product-detail__rating">
              <Stars rating={product.rating} />
              <span className="rating-val">{product.rating.toFixed(1)}</span>
              <span className="rating-count">({product.numReviews} reviews)</span>
            </div>
            <div className="product-detail__price">${product.price.toFixed(2)}</div>
            <p className="product-detail__desc">{product.description}</p>

            <div className="product-detail__meta-grid">
              <div className="meta-item"><span>Brand</span><strong>{product.brand}</strong></div>
              <div className="meta-item"><span>Stock</span><strong className={product.stock < 5 ? 'text-danger' : 'text-success'}>{product.stock > 0 ? `${product.stock} left` : 'Out of stock'}</strong></div>
            </div>

            {product.stock > 0 && (
              <div className="qty-row">
                <label className="form-label">Quantity</label>
                <div className="qty-controls">
                  <button id="qty-dec" onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
                  <span>{qty}</span>
                  <button id="qty-inc" onClick={() => setQty(q => Math.min(product.stock, q+1))}>+</button>
                </div>
              </div>
            )}

            <button
              id="add-to-cart-detail"
              className="btn btn-primary btn-lg btn-full"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <FiShoppingCart /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <div className="product-detail__trust">
              <div className="trust-item"><FiTruck /><span>Free shipping on orders over $100</span></div>
              <div className="trust-item"><FiShield /><span>Secure 256-bit SSL checkout</span></div>
              <div className="trust-item"><FiPackage /><span>30-day hassle-free returns</span></div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2 className="section-title" style={{fontSize:'1.5rem',marginBottom:'1.5rem'}}>
            Customer Reviews ({product.numReviews})
          </h2>

          {product.reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first!</p>
          ) : (
            <div className="reviews-list">
              {product.reviews.map((r) => (
                <div key={r._id} className="review-card card">
                  <div className="review-header">
                    <div className="reviewer-avatar">{r.name.charAt(0)}</div>
                    <div>
                      <div className="reviewer-name">{r.name}</div>
                      <Stars rating={r.rating} size={13} />
                    </div>
                    <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {user && (
            <form className="review-form card" onSubmit={handleReview} id="review-form">
              <h3>Write a Review</h3>
              {reviewMsg && <div className={`alert ${reviewMsg.includes('!') ? 'alert-success' : 'alert-error'}`}>{reviewMsg}</div>}
              <div className="form-group">
                <label className="form-label">Rating</label>
                <select id="review-rating" className="form-input" value={review.rating} onChange={e => setReview(r => ({...r, rating: Number(e.target.value)}))}>
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea id="review-comment" className="form-input" rows={3} value={review.comment} onChange={e => setReview(r => ({...r, comment: e.target.value}))} placeholder="Share your experience..." required />
              </div>
              <button type="submit" id="submit-review" className="btn btn-primary">Submit Review</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
