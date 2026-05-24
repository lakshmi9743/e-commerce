import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './LoginPage.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    if (!isLogin && !form.name) return toast.error('Please enter your name');

    const result = isLogin
      ? await login(form.email, form.password)
      : await register(form.name, form.email, form.password);

    if (result.success) {
      toast.success(isLogin ? 'Welcome back! 👋' : 'Account created! 🎉');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-orb orb1" />
      <div className="login-bg-orb orb2" />

      <div className="login-card card">
        {/* Header */}
        <div className="login-logo">⚡ NexShop</div>
        <h1 className="login-title">{isLogin ? 'Welcome back' : 'Create account'}</h1>
        <p className="login-subtitle">
          {isLogin ? 'Sign in to your account to continue' : 'Join thousands of happy shoppers'}
        </p>

        {/* Toggle */}
        <div className="login-toggle">
          <button
            id="tab-login"
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >Sign In</button>
          <button
            id="tab-register"
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >Register</button>
        </div>

        <form onSubmit={handleSubmit} id="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrap">
                <FiUser className="input-icon" />
                <input
                  id="field-name"
                  type="text"
                  className="form-input input-with-icon"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrap">
              <FiMail className="input-icon" />
              <input
                id="field-email"
                type="email"
                className="form-input input-with-icon"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <FiLock className="input-icon" />
              <input
                id="field-password"
                type="password"
                className="form-input input-with-icon"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                required
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <FiArrowRight />}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="demo-creds">
          <p className="demo-title">🧪 Demo Accounts</p>
          <div className="demo-grid">
            <button className="demo-btn" id="demo-user-btn" onClick={() => { setForm({ name:'', email:'user@store.com', password:'user123' }); setIsLogin(true); }}>
              <span>User</span>
              <code>user@store.com</code>
            </button>
            <button className="demo-btn" id="demo-admin-btn" onClick={() => { setForm({ name:'', email:'admin@store.com', password:'admin123' }); setIsLogin(true); }}>
              <span>Admin</span>
              <code>admin@store.com</code>
            </button>
          </div>
        </div>

        <p className="login-switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button className="link-btn" id="switch-mode-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
