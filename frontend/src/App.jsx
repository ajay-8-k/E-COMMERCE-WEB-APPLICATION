import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Dashboard from './pages/Dashboard';
import ManageProducts from './pages/ManageProducts';
import ManageOrders from './pages/ManageOrders';

// Simple Not Found Component
const NotFound = () => (
  <div className="card text-center" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
    <h1 style={{ fontSize: '3rem', color: 'var(--primary)' }}>404</h1>
    <h2>Page Not Found</h2>
    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
      The URL path you entered does not exist or you do not have permission to view it.
    </p>
    <a href="/" className="btn btn-primary">Go to Home</a>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-container">
            {/* Navigation Header */}
            <Navbar />

            {/* Main Application Area */}
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />

                {/* Protected User Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-orders"
                  element={
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Dashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <ManageProducts />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <ManageOrders />
                    </AdminRoute>
                  }
                />

                {/* 404 Fallback Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Premium Footer */}
            <footer style={{
              marginTop: 'auto',
              backgroundColor: 'var(--bg-card)',
              borderTop: '1px solid var(--border-light)',
              padding: '1.5rem 1rem',
              textAlign: 'center',
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ maxWidth: 'var(--container-width)', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <span>&copy; 2026 ShopEasy Store. Built for College Academic Project.</span>
                <span style={{ fontWeight: '500' }}>Developer Console &middot; Protected Admin Portal</span>
              </div>
            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
