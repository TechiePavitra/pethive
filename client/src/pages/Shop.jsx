import { useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import { Helmet } from 'react-helmet-async';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = selectedCategory ? { category: selectedCategory } : {};
    api.get('/products', { params })
      .then(res => {
        // Handle both old format (array) and new format (object with products array)
        const productsData = Array.isArray(res.data) ? res.data : res.data.products;
        setProducts(productsData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load products. Please make sure the backend server is running.');
        setLoading(false);
      });
  }, [selectedCategory]);

  useEffect(() => {
    // Fetch categories
    api.get('/categories').then(res => setCategories(res.data)).catch(err => console.error(err));
    
    // Fetch products
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Shop - PetHive</title>
        <meta name="description" content="Browse our wide selection of pet products including food, toys, and accessories." />
      </Helmet>
      <h1 className="text-3xl font-bold mb-8">Shop All Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <h3 className="font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`block w-full text-left px-2 py-1 rounded ${!selectedCategory ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100'}`}
            >
              All Categories
            </button>
            {Array.isArray(categories) && categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`block w-full text-left px-2 py-1 rounded ${selectedCategory === cat.slug ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(products) && products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12 text-gray-500">No products found.</div>
          )}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-2">{error}</p>
              <p className="text-sm text-gray-500">Please enable the backend server.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
