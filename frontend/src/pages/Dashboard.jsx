import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, DollarSign, ShoppingBag, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/orders')
        ]);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        setError('Failed to fetch admin stats. Ensure you are logged in as an administrator.');
        console.error('Fetch admin stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  // Statistics calculation helpers
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const outOfStockProducts = products.filter(p => p.stock <= 0).length;
  
  const totalSales = orders.reduce((sum, order) => {
    return sum + order.totalAmount;
  }, 0);

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <div>
      <h1 style={{ marginBottom: '0.25rem' }}>Admin Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>Management overview for ShopEasy store operations and analytics</p>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <span>{error}</span>
        </div>
      )}

      {/* Key Store Stats Cards Grid */}
      <div className="grid-3" style={{ marginTop: '0', marginBottom: '3rem' }}>
        {/* Total Revenue card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="flex-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', width: '50px', height: '50px', borderRadius: 'var(--radius-md)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'block', fontWeight: '500' }}>Total Revenue</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>${totalSales.toFixed(2)}</span>
          </div>
        </div>

        {/* Total Orders card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="flex-center" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', width: '50px', height: '50px', borderRadius: 'var(--radius-md)' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'block', fontWeight: '500' }}>Total Orders</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{totalOrders}</span>
          </div>
        </div>

        {/* Total Catalog Items card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="flex-center" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--secondary)', width: '50px', height: '50px', borderRadius: 'var(--radius-md)' }}>
            <Package size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'block', fontWeight: '500' }}>Catalog Products</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{totalProducts}</span>
          </div>
        </div>
      </div>

      {/* Task Warnings panel cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem' }}>
        {/* Pending Deliveries task callout */}
        <div className="card" style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', marginBottom: '1rem' }}>
              <Clock size={20} />
              <h3 style={{ fontSize: '1.1rem', margin: '0' }}>Pending Deliveries</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              There are currently <strong>{pendingOrders}</strong> orders awaiting status updates and physical shipping dispatch.
            </p>
          </div>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center' }}>
            Fulfill Orders <ArrowRight size={14} style={{ marginLeft: '0.25rem' }} />
          </Link>
        </div>

        {/* Inventory depletion alert callout */}
        <div className="card" style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', marginBottom: '1rem' }}>
              <AlertTriangle size={20} />
              <h3 style={{ fontSize: '1.1rem', margin: '0' }}>Stock Alerts</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              There are <strong>{outOfStockProducts}</strong> catalog products currently flagged as out of stock (quantity zero).
            </p>
          </div>
          <Link to="/admin/products" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center' }}>
            Update Inventory <ArrowRight size={14} style={{ marginLeft: '0.25rem' }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
