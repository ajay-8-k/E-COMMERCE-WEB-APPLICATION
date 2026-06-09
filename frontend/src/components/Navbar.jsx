import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  ClipboardList
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <ShoppingBag size={24} />
          <span>ShopEasy</span>
        </Link>

        <div className="navbar-links">
          <NavLink to="/products" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
            <Package size={18} />
            <span>Products</span>
          </NavLink>

          {/* Links shown to guests only */}
          {!user && (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                <span>Login</span>
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                <span>Register</span>
              </NavLink>
            </>
          )}

          {/* Links shown to logged-in standard users */}
          {user && user.role === 'user' && (
            <>
              <NavLink to="/cart" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} style={{ position: 'relative' }}>
                <ShoppingCart size={18} />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-10px',
                    backgroundColor: 'var(--danger)',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {cartItemCount}
                  </span>
                )}
              </NavLink>
              <NavLink to="/my-orders" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                <ClipboardList size={18} />
                <span>My Orders</span>
              </NavLink>
            </>
          )}

          {/* Links shown to admins only */}
          {user && user.role === 'admin' && (
            <>
              <NavLink to="/admin" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} end>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                <Package size={18} />
                <span>Manage Products</span>
              </NavLink>
              <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                <ClipboardList size={18} />
                <span>Manage Orders</span>
              </NavLink>
            </>
          )}

          {/* Logged in User Profile Info and Logout Action Button */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border-light)', paddingLeft: '1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <User size={14} />
                {user.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center' }} title="Logout">
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
