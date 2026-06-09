import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { ShieldCheck, Truck, Headphones, ChevronRight } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        // Fetch and show top 3 products on the home landing view
        setProducts(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Banner Section */}
      <section style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
        color: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '4rem 2rem',
        textAlign: 'center',
        marginBottom: '3rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '1rem' }}>Welcome to ShopEasy</h1>
        <p style={{ fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 2rem auto', opacity: 0.9, lineHeight: '1.6' }}>
          Your one-stop academic demonstration store. Discover high-quality products at student-friendly prices with lightning-fast delivery.
        </p>
        <Link to="/products" className="btn btn-primary" style={{ backgroundColor: 'white', color: 'var(--primary)', fontSize: '1rem', padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center' }}>
          Explore Products
          <ChevronRight size={18} style={{ marginLeft: '0.25rem' }} />
        </Link>
      </section>

      {/* Selling Points Grid Section */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Why Shop With Us?</h2>
        <div className="grid-3" style={{ marginTop: '0' }}>
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="flex-center" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', width: '50px', height: '50px', borderRadius: '50%', margin: '0 auto 1.25rem auto' }}>
              <Truck size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Fast Delivery</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Get your orders delivered to your doorstep in campus within 24-48 hours. Free shipping available.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="flex-center" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', width: '50px', height: '50px', borderRadius: '50%', margin: '0 auto 1.25rem auto' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Secure Payment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Standard encryption protocols ensuring all transactions are processed securely and privately.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="flex-center" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', width: '50px', height: '50px', borderRadius: '50%', margin: '0 auto 1.25rem auto' }}>
              <Headphones size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>24/7 Support</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Round the clock assistance for student order inquiries, refunds, and technical support.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products Listing Section */}
      <section style={{ marginBottom: '2rem' }}>
        <div className="flex-row-between" style={{ marginBottom: '1.5rem' }}>
          <h2>Featured Products</h2>
          <Link to="/products" className="navbar-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}>
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid-3" style={{ marginTop: '0' }}>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="card text-center" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No products found. Please seed the database first to see sample products.
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
