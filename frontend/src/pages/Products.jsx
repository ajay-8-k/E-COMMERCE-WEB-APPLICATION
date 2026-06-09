import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter Inputs Local State
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load catalog products. Ensure backend database server is reachable.');
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter computation on user parameters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = maxPrice === '' || product.price <= parseFloat(maxPrice);
    const matchesStock = !inStockOnly || product.stock > 0;
    
    return matchesSearch && matchesPrice && matchesStock;
  });

  return (
    <div>
      <div className="flex-row-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Our Products</h1>
          <p style={{ color: 'var(--text-muted)' }}>Explore our range of premium student accessories and gadgets</p>
        </div>
        <button onClick={fetchProducts} className="btn btn-outline btn-sm" style={{ gap: '0.25rem', display: 'flex', alignItems: 'center' }}>
          <RefreshCw size={14} /> Refresh Catalog
        </button>
      </div>

      {/* Filter Options Panel Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          {/* Text Search Box */}
          <div style={{ flex: '2 1 300px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products by name or description..."
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Pricing Upper Bound Input */}
          <div style={{ flex: '1 1 150px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Max Price:</span>
            <input
              type="number"
              className="form-control"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
            />
          </div>

          {/* Stock Availability Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', userSelect: 'none' }}>
            <input
              type="checkbox"
              id="inStockOnly"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="inStockOnly" style={{ fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>In Stock Only</label>
          </div>
        </div>
      </div>

      {/* Content Rendering Grid */}
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" style={{ justifyContent: 'center' }}>
          <span>{error}</span>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid-3" style={{ marginTop: '0' }}>
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <SlidersHorizontal size={40} style={{ margin: '0 auto 1.25rem auto', opacity: 0.4 }} />
          <h3>No products match your criteria</h3>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Try clearing your search query or widening the price limit.</p>
          <button
            onClick={() => { setSearchTerm(''); setMaxPrice(''); setInStockOnly(false); }}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '1.25rem' }}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
