import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food', 'Other'];
const SORTS = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A-Z' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const keyword  = searchParams.get('keyword')  || '';
  const category = searchParams.get('category') || 'All';
  const sort     = searchParams.get('sort')     || 'createdAt';
  const page     = Number(searchParams.get('page') || 1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (keyword) params.keyword = keyword;
      if (category !== 'All') params.category = category;
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [keyword, category, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, val);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };
  const clearFilters = () => setSearchParams({});

  return (
    <div className="page">
      <div className="container">
        <div className="products-header">
          <div>
            <h1 className="section-title">All Products</h1>
            <p className="section-subtitle">{total} products found</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              id="product-search"
              className="form-input search-input"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setParam('keyword', e.target.value)}
            />
            {keyword && <button className="search-clear" onClick={() => setParam('keyword', '')}><FiX /></button>}
          </div>

          <div className="filter-group">
            <select id="category-filter" className="form-input filter-select" value={category} onChange={(e) => setParam('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select id="sort-filter" className="form-input filter-select" value={sort} onChange={(e) => setParam('sort', e.target.value)}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            {(keyword || category !== 'All') && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters} id="clear-filters-btn">
                <FiX /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          {CATEGORIES.map((c) => (
            <button key={c} id={`cat-${c}`} className={`pill ${category === c ? 'active' : ''}`} onClick={() => setParam('category', c)}>
              {c}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <FiSearch size={48} />
            <h3>No products found</h3>
            <p>Try different keywords or clear your filters</p>
            <button className="btn btn-primary" style={{marginTop:'1rem'}} onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="product-grid">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} id={`page-${p}`} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setParam('page', p)}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
