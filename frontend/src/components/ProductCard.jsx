import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Avoid navigating to the details page on button click
    
    if (!user) {
      navigate('/login');
      return;
    }

    setAdding(true);
    setError('');
    try {
      await addToCart(product._id, 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <Link to={`/products/${product._id}`} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Product Image Panel */}
      <div style={{ height: '200px', overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '1rem', backgroundColor: '#f1f5f9' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            // Unsplash placeholder fallback in case of loading error
            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600';
          }}
        />
      </div>

      {/* Product Info Description Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ 
          fontSize: '1.05rem', 
          marginBottom: '0.5rem', 
          height: '2.5rem', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          display: '-webkit-box', 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical' 
        }}>
          {product.name}
        </h3>
        
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.825rem',
          marginBottom: '1rem',
          height: '2.5rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {product.description}
        </p>

        {/* Pricing & Stock indicators */}
        <div className="flex-row-between" style={{ marginTop: 'auto', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
            ${product.price.toFixed(2)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: '500' }}>
            {isOutOfStock ? (
              <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <XCircle size={14} /> Out of Stock
              </span>
            ) : (
              <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle size={14} /> In Stock ({product.stock})
              </span>
            )}
          </span>
        </div>

        {/* Action Button: Disabled for admin role */}
        {(!user || user.role === 'user') && (
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className="btn btn-primary"
            style={{ width: '100%', gap: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ShoppingCart size={16} />
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
        )}
        
        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center' }}>
            {error}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
