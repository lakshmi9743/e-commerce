import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    const existing = items.find((i) => i._id === product._id);
    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) { toast.error('Not enough stock'); return; }
      setItems((prev) => prev.map((i) => i._id === product._id ? { ...i, quantity: newQty } : i));
      toast.success('Cart updated!');
    } else {
      if (quantity > product.stock) { toast.error('Not enough stock'); return; }
      setItems((prev) => [...prev, { ...product, quantity }]);
      toast.success('Added to cart!');
    }
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
    toast.success('Removed from cart');
  };

  const updateQty = (id, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => i._id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const total     = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
