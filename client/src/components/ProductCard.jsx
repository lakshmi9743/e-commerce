import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const Stars = ({ rating }) => (
  <div className="stars">
    {[1,2,3,4,5].map((s) => (
      <FiStar key={s} size={12} className={s <= Math.round(rating) ? 'star-filled' : 'star-empty'} fill={s <= Math.round(rating) ? 'currentColor' : 'none'} />
    ))}
  </div>
);

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card fade-up">
      <Link to={`/products/${product._id}`} className="product-card__image-wrap">
        <img src={product.image} alt={product.name} className="product-card__image" loading="lazy" />
        {product.stock === 0 && <span className="out-of-stock-badge">Out of Stock</span>}
        {product.featured && <span className="featured-badge">⭐ Featured</span>}
      </Link>

      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <Link to={`/products/${product._id}`}>
          <h3 className="product-card__name">{product.name}</h3>
        </Link>

        <div className="product-card__meta">
          <Stars rating={product.rating} />
          <span className="product-card__reviews">({product.numReviews})</span>
        </div>

        <div className="product-card__footer">
          <span className="product-card__price">₹{product.price.toFixed(2)}</span>
          <button
            className="btn btn-primary btn-sm add-to-cart-btn"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            id={`add-to-cart-${product._id}`}
          >
            <FiShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
