import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, RefreshCw, AlertCircle } from 'lucide-react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Management Local State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products. Ensure backend database server is reachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setName('');
    setPrice('');
    setStock('');
    setImage('');
    setDescription('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setImage(product.image);
    setDescription(product.description);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id, productName) => {
    if (window.confirm(`Are you sure you want to permanently delete "${productName}" from the catalog?`)) {
      try {
        await axios.delete(`/api/products/${id}`);
        setSuccess(`Successfully deleted "${productName}" from the store database.`);
        fetchProducts();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to remove product.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !stock || !image || !description) {
      setError('Please fill in all fields.');
      return;
    }

    if (parseFloat(price) < 0 || parseInt(stock) < 0) {
      setError('Price and Stock quantity thresholds cannot be negative.');
      return;
    }

    setError('');
    const productData = {
      name,
      description,
      price: parseFloat(price),
      image,
      stock: parseInt(stock)
    };

    try {
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, productData);
        setSuccess(`Successfully updated product details for: ${name}.`);
      } else {
        await axios.post('/api/products', productData);
        setSuccess(`Successfully created and added new product: ${name}.`);
      }
      resetForm();
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to persist product update.');
    }
  };

  return (
    <div>
      <div className="flex-row-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Manage Products</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>Create, update, or remove items from the store catalog</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchProducts} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} title="Reload Catalog">
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}
            className="btn btn-primary"
          >
            {showForm ? (
              <>
                <X size={16} />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Add Product</span>
              </>
            )}
          </button>
        </div>
      </div>

      {success && (
        <div className="alert alert-success">
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Interactive Form Panel */}
      {showForm && (
        <div className="card" style={{ marginBottom: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
            {editingId ? 'Modify Product Specifications' : 'Insert New Catalog Product'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div className="form-group" style={{ flex: '2 1 300px' }}>
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Pro Wireless Headphones"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ flex: '1 1 120px' }}>
                <label className="form-label">Unit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div className="form-group" style={{ flex: '1 1 120px' }}>
                <label className="form-label">Stock Count</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Image Source URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label">Product Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter details regarding item, specs, and materials..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" onClick={resetForm} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Save Updates' : 'Create Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Catalog items display list table */}
      {loading && !showForm ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="card" style={{ padding: '0' }}>
          {products.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No products found in store database. Click Add Product to create one.
            </p>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Specs</th>
                    <th>Unit Price</th>
                    <th>Inventory</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td style={{ width: '80px' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: '#f1f5f9' }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600';
                          }}
                        />
                      </td>
                      <td>
                        <span style={{ fontWeight: '600', color: 'var(--text-main)', display: 'block' }}>{product.name}</span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)', 
                          display: 'block', 
                          maxWidth: '400px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {product.description}
                        </span>
                      </td>
                      <td style={{ fontWeight: '600' }}>${product.price.toFixed(2)}</td>
                      <td>
                        {product.stock <= 0 ? (
                          <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Out of Stock</span>
                        ) : (
                          <span>{product.stock} units</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEditClick(product)}
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--primary)', borderColor: 'rgba(79, 70, 229, 0.15)', padding: '0.5rem' }}
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product._id, product.name)}
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.15)', padding: '0.5rem' }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
