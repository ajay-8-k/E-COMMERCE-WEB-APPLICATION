import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, cartTotalAmount } = useCart();
  const navigate = useNavigate();

  const handleQtyChange = async (productId, newQty, stockLimit) => {
    if (newQty < 1) return;
    if (newQty > stockLimit) return;
    await updateQuantity(productId, newQty);
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
  };

  if (loading && !cart) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const cartItems = cart?.products || [];

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <ShoppingCart size={48} style={{ margin: '0 auto 1.25rem auto', color: 'var(--text-muted)', opacity: 0.4 }} />
          <h2>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
            Looks like you haven't added any items to your shopping cart yet.
          </p>
          <Link to="/products" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <ArrowLeft size={16} style={{ marginRight: '0.25rem' }} /> Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          {/* Shopping Cart Items List Panel */}
          <div style={{ flex: '2 1 600px' }}>
            {cartItems.map((item) => {
              const product = item.productId;
              if (!product) return null;

              return (
                <div key={product._id} className="card" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1.5rem', 
                  padding: '1.25rem', 
                  marginBottom: '1rem', 
                  flexWrap: 'wrap' 
                }}>
                  {/* Thumbnail Image display */}
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)', backgroundColor: '#f1f5f9' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600';
                    }}
                  />

                  {/* Product Metadata Info */}
                  <div style={{ flex: '1 1 200px' }}>
                    <Link to={`/products/${product._id}`} style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text-main)' }}>
                      {product.name}
                    </Link>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Price: ${product.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity adjustment buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleQtyChange(product._id, item.quantity - 1, product.stock)}
                      disabled={item.quantity <= 1}
                      className="btn btn-outline"
                      style={{ padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center' }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQtyChange(product._id, item.quantity + 1, product.stock)}
                      disabled={item.quantity >= product.stock}
                      className="btn btn-outline"
                      style={{ padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Item subtotal computation & delete icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: 'auto' }}>
                    <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-main)' }}>
                      ${(product.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.15)', padding: '0.5rem' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout pricing panel */}
          <div style={{ flex: '1 1 300px' }}>
            <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
              <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Total:</span>
                <span style={{ fontWeight: '600' }}>
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)} units
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping Costs:</span>
                <span style={{ fontWeight: '600', color: 'var(--success)' }}>FREE</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: '600' }}>Subtotal Amount:</span>
                <span style={{ fontWeight: '800', fontSize: '1.3rem', color: 'var(--primary)' }}>
                  ${cartTotalAmount.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/products" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ArrowLeft size={12} /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
