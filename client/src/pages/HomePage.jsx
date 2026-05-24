import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const features = [
  { icon: <FiTruck />,      title: 'Free Shipping',   desc: 'On orders over $100' },
  { icon: <FiShield />,     title: 'Secure Payment',  desc: '100% protected checkout' },
  { icon: <FiRefreshCw />,  title: 'Easy Returns',    desc: '30-day hassle-free returns' },
  { icon: <FiShoppingBag />,title: 'Best Deals',      desc: 'Curated daily offers' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/featured')
      .then(({ data }) => setFeatured(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg-orb orb1" />
        <div className="hero__bg-orb orb2" />
        <div className="container hero__content">
          <div className="hero__tag">🔥 New Arrivals Every Week</div>
          <h1 className="hero__title">
            Shop the Future,<br />
            <span className="gradient-text">Delivered Today</span>
          </h1>
          <p className="hero__subtitle">
            Discover thousands of premium products — from cutting-edge electronics to everyday essentials — all in one place.
          </p>
          <div className="hero__cta">
            <Link to="/products" className="btn btn-primary btn-lg" id="hero-shop-btn">
              Shop Now <FiArrowRight />
            </Link>
            <Link to="/products?category=Electronics" className="btn btn-ghost btn-lg" id="hero-electronics-btn">
              Explore Electronics
            </Link>
          </div>
          <div className="hero__stats">
            <div className="stat"><span className="stat-num">12K+</span><span>Products</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">50K+</span><span>Happy Customers</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">4.9★</span><span>Average Rating</span></div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="features-bar">
        <div className="container features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              <div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container featured-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Hand-picked top sellers just for you</p>
          </div>
          <Link to="/products" className="btn btn-secondary" id="view-all-btn">
            View All <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <div className="product-grid">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="container">
        <div className="cta-banner">
          <div className="cta-banner__orb" />
          <h2>Ready to explore more?</h2>
          <p>Browse our full catalog of premium products across all categories.</p>
          <Link to="/products" className="btn btn-primary btn-lg" id="cta-browse-btn">
            Browse All Products <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
