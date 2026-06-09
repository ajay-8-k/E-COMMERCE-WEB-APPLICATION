import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, ClipboardList, AlertCircle, Check } from 'lucide-react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch store orders. Make sure you are authorized as an administrator.');
      console.error('Fetch admin orders list error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setError('');
      setSuccess('');
      
      const response = await axios.put(`/api/orders/${orderId}`, { status: newStatus });
      
      // Update local orders states list with modifications
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: response.data.status } : o));
      
      setSuccess(`Successfully updated status of order #${orderId.substring(orderId.length - 8).toUpperCase()} to ${newStatus}.`);
      // Clear popup alert automatically
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  const getStatusClass = (status) => {
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

  return (
    <div>
      <div className="flex-row-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Manage Orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>Fulfill client checkout requests and modify shipping stages</p>
        </div>
        <button onClick={fetchOrders} className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <RefreshCw size={16} /> Refresh Orders
        </button>
      </div>

      {success && (
        <div className="alert alert-success">
          <Check size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="card" style={{ padding: '0' }}>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
              <ClipboardList size={48} style={{ margin: '0 auto 1.25rem auto', opacity: 0.4 }} />
              <h3>No Customer Orders Recieved</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>When client accounts complete checkout payments, details will appear here.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Profile</th>
                    <th>Order Date</th>
                    <th>Items Summary</th>
                    <th>Destination</th>
                    <th>Subtotal</th>
                    <th>Fulfillment Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const customer = order.userId;
                    return (
                      <tr key={order._id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: '600' }}>
                          #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </td>
                        <td>
                          {customer ? (
                            <>
                              <span style={{ fontWeight: '600', display: 'block', color: 'var(--text-main)' }}>{customer.name}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{customer.email}</span>
                            </>
                          ) : (
                            <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>System User</span>
                          )}
                        </td>
                        <td style={{ fontSize: '0.825rem' }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem' }}>
                            {order.products.map((p, idx) => (
                              <span key={idx} style={{ color: 'var(--text-main)' }}>
                                • {p.name} <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>({p.quantity})</span>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.825rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={order.address}>
                          {order.address}
                        </td>
                        <td style={{ fontWeight: '700', color: 'var(--primary)' }}>
                          ${order.totalAmount.toFixed(2)}
                        </td>
                        <td>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="form-control"
                              style={{ 
                                padding: '0.25rem 0.5rem', 
                                fontSize: '0.8rem', 
                                borderRadius: 'var(--radius-sm)', 
                                border: '1px solid var(--border-light)',
                                width: '105px',
                                cursor: 'pointer',
                                fontWeight: '500'
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                            <span className={getStatusClass(order.status)} style={{ minWidth: '70px', textAlign: 'center' }}>
                              {order.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
