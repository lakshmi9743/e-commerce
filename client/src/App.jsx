import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/"              element={<HomePage />} />
            <Route path="/products"      element={<ProductsPage />} />
            <Route path="/products/:id"  element={<ProductDetailPage />} />
            <Route path="/cart"          element={<CartPage />} />
            <Route path="/login"         element={<LoginPage />} />
            <Route path="/checkout"      element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/orders"        element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id"    element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/admin"         element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#16162a',
                color: '#f0f0ff',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: '0.88rem',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#16162a' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#16162a' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
