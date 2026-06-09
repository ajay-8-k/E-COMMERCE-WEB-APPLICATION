import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { CreditCard, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotalAmount, clearCartState } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please provide a physical shipping address.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.post('/api/orders', { address });
      // Reset local cart variables on successful placement
      clearCartState();
      navigate('/my-orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Some items might have sold out.');
    } finally {
      setLoading(false);
    }
  };

  const cartItems = cart?.products || [];

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="alert alert-danger" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
          <span>Your cart is empty. Please add items to checkout.</span>
        </div>
        <div>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link to="/cart" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '2rem' }}>
        <ArrowLeft size={14} /> Back to Cart
      </Link>

      <h1 style={{ marginBottom: '1.5rem' }}>Checkout</h1>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {/* Delivery Address Input Form */}
        <div style={{ flex: '2 1 500px' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Shipping Address</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label" htmlFor="address">Delivery Destination</label>
                <textarea
                  id="address"
                  className="form-control"
                  rows="4"
                  placeholder="e.g. Room 405, Hostel C, Campus West, University Town"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ resize: 'vertical', minHeight: '100px' }}
                  required
                ></textarea>
              </div>

              {/* Informative Campus Shipping COD Box */}
              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#ecfdf5', 
                border: '1px solid #a7f3d0', 
                borderRadius: 'var(--radius-md)', 
                display: 'flex', 
                gap: '0.75rem', 
                marginBottom: '2rem' 
              }}>
                <CheckCircle size={20} style={{ color: '#059669', flexShrink: 0 }} />
                <div>
                  <h4 style={{ color: '#065f46', fontSize: '0.875rem', marginBottom: '0.15rem' }}>Cash on Delivery (COD) Enabled</h4>
                  <p style={{ color: '#047857', fontSize: '0.8rem' }}>
                    Currently, we only support COD for campus orders. Payment is collected upon physical delivery.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                disabled={loading}
              >
                <CreditCard size={18} />
                {loading ? 'Processing Order...' : 'Place Order (COD)'}
              </button>
            </form>
          </div>
        </div>

        {/* Pricing Summary Sidebar */}
        <div style={{ flex: '1 1 300px' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Review Items</h3>
            
            <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '1.5rem' }}>
              {cartItems.map((item) => {
                const product = item.productId;
                if (!product) return null;
                return (
                  <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ maxWidth: '70%' }}>
                      <p style={{ fontWeight: '500', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Qty: {item.quantity} × ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>
                      ${(product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', fontWeight: '700', fontSize: '1.05rem' }}>
              <span>Total Payment:</span>
              <span style={{ color: 'var(--primary)' }}>${cartTotalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
