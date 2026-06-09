import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, ShoppingBag, Calendar, MapPin, DollarSign } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/orders');
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch your orders. Please check your network connection.');
        console.error('Fetch user orders error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Shipped':
        return 'badge badge-shipped';
      case 'Delivered':
        return 'badge badge-delivered';
      case 'Pending':
      default:
        return 'badge badge-pending';
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>My Orders</h1>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <span>{error}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="card text-center" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <ClipboardList size={48} style={{ margin: '0 auto 1.25rem auto', color: 'var(--text-muted)', opacity: 0.4 }} />
          <h2>No Orders Found</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.925rem' }}>
            You haven't placed any orders yet. Once you complete checkout, your transaction details will appear here.
          </p>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id} className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
              {/* Order Transaction Header details */}
              <div className="flex-row-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>ORDER ID</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: '600', color: 'var(--text-main)' }}>{order._id}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Calendar size={14} />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <MapPin size={14} />
                    <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={order.address}>
                      {order.address}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>
                    <DollarSign size={14} />
                    <span>Total Payment: ${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <span className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Ordered items listing */}
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>Items Ordered:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {order.products.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShoppingBag size={14} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontWeight: '500' }}>{item.name}</span>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {item.quantity} × ${item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
