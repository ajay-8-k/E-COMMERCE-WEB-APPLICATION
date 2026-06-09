import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('The product you are looking for does not exist or has been removed.');
        console.error('Fetch product detail error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setAdding(true);
    setSuccessMsg('');
    try {
      await addToCart(product._id, quantity);
      setSuccessMsg(`Successfully added ${quantity} item(s) to your cart!`);
      // Automatically clear confirmation message after timeout
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add items to cart.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="alert alert-danger" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
          <span>{error || 'Product details could not be loaded.'}</span>
        </div>
        <div>
          <Link to="/products" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div>
      <Link to="/products" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '2rem' }}>
        <ArrowLeft size={14} /> Back to Products
      </Link>

      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
          {/* Product Image Cover Display */}
          <div style={{ flex: '1 1 400px', maxHeight: '450px', overflow: 'hidden', borderRadius: 'var(--radius-lg)', backgroundColor: '#f1f5f9' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600';
              }}
            />
          </div>

          {/* Product Meta Specs Panel */}
          <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.75rem' }}>{product.name}</h1>
            
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1.25rem' }}>
              ${product.price.toFixed(2)}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              {isOutOfStock ? (
                <span className="badge badge-pending" style={{ padding: '0.5rem 0.875rem', fontSize: '0.8rem', gap: '0.25rem' }}>
                  <XCircle size={14} /> Out of Stock
                </span>
              ) : (
                <span className="badge badge-delivered" style={{ padding: '0.5rem 0.875rem', fontSize: '0.8rem', gap: '0.25rem' }}>
                  <CheckCircle size={14} /> In Stock ({product.stock} remaining)
                </span>
              )}
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem', fontSize: '0.925rem' }}>
              {product.description}
            </p>

            {/* Shopping Controls: Visible for guests/users, hidden for admin */}
            {(!user || user.role === 'user') && (
              <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
                {!isOutOfStock && (
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <label className="form-label" htmlFor="quantity" style={{ marginBottom: 0, fontWeight: '600' }}>Quantity:</label>
                    <input
                      type="number"
                      id="quantity"
                      className="form-control"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      min="1"
                      max={product.stock}
                      style={{ width: '85px' }}
                    />
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || adding}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <ShoppingCart size={18} />
                  {adding ? 'Adding to Cart...' : 'Add to Shopping Cart'}
                </button>
              </div>
            )}

            {successMsg && (
              <div className="alert alert-success" style={{ marginTop: '1rem' }}>
                <span>{successMsg}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
