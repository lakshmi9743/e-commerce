import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiSettings, FiPackage } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="logo-icon">⚡</span>
          <span>NexShop</span>
        </Link>

        <div className={`navbar__links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setMenuOpen(false)}>Products</NavLink>
          {user && <NavLink to="/orders" onClick={() => setMenuOpen(false)}>My Orders</NavLink>}
          {isAdmin && <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>}
        </div>

        <div className="navbar__actions">
          <Link to="/cart" className="cart-btn" id="nav-cart-btn">
            <FiShoppingCart size={20} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu" ref={dropRef}>
              <button className="user-avatar" onClick={() => setDropOpen(!dropOpen)} id="user-menu-btn">
                {user.name.charAt(0).toUpperCase()}
              </button>
              {dropOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user.name}</span>
                    <span className="dropdown-email">{user.email}</span>
                    {isAdmin && <span className="badge badge-shipped" style={{marginTop:'4px'}}>Admin</span>}
                  </div>
                  <div className="divider" />
                  <Link to="/orders" onClick={() => setDropOpen(false)} id="dropdown-orders">
                    <FiPackage size={15}/> My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setDropOpen(false)} id="dropdown-admin">
                      <FiSettings size={15}/> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-logout" id="dropdown-logout">
                    <FiLogOut size={15}/> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" id="nav-login-btn">
              <FiUser size={15} /> Login
            </Link>
          )}

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} id="mobile-menu-btn">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
