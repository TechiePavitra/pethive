import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', categoryId: '', 
    stock: '', images: '', discount: '0', isOffer: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      // Handle both old format (array) and new format (object with products array)
      const productsData = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.products;
      setProducts(productsData);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Error loading data', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`, { withCredentials: true });
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    let imageUrl = '';
    try {
        const parsed = JSON.parse(product.images);
        imageUrl = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch (e) {
        imageUrl = product.images;
    }

    setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        stock: product.stock,
        images: imageUrl, 
        discount: product.discount,
        isOffer: product.isOffer
    });
    setIsAdding(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        images: JSON.stringify([formData.images]), // Wrap in array for schema consistency
      };

      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload, { withCredentials: true });
      } else {
        await api.post('/admin/products', payload, { withCredentials: true });
      }
      
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', categoryId: '', stock: '', images: '', discount: '0', isOffer: false });
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Operation failed');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Product Manager</h2>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', description: '', price: '', categoryId: categories[0]?.id || '', stock: '', images: '', discount: '0', isOffer: false }); }}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingId ? 'Edit Product' : 'New Product'}</h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input required className="w-full border rounded-lg p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input required type="number" step="0.01" className="w-full border rounded-lg p-2" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required className="w-full border rounded-lg p-2 h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full border rounded-lg p-2" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input required type="number" className="w-full border rounded-lg p-2" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input required className="w-full border rounded-lg p-2" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} placeholder="https://..." />
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                  <input type="number" className="w-full border rounded-lg p-2" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="isOffer" className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500" checked={formData.isOffer} onChange={e => setFormData({...formData, isOffer: e.target.checked})} />
                  <label htmlFor="isOffer" className="text-sm font-medium text-gray-700">Special Offer?</label>
                </div>
              </div>

              <button type="submit" className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors">
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-medium text-gray-500">Product</th>
              <th className="p-4 font-medium text-gray-500">Price</th>
              <th className="p-4 font-medium text-gray-500">Stock</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
              <th className="p-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => {
                let img = '';
                try { img = JSON.parse(product.images)[0]; } catch(e) { img = product.images; }
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={img} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">${product.price}</td>
                    <td className="p-4 text-gray-600">{product.stock}</td>
                    <td className="p-4">
                      {product.isOffer && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">Offer</span>}
                      {product.discount > 0 && <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium ml-2">-{product.discount}%</span>}
                    </td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleEdit(product)} className="text-gray-400 hover:text-amber-500 transition-colors"><Edit2 className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </td>
                  </tr>
                );
            })}
          </tbody>
        </table>
        {products.length === 0 && <div className="p-8 text-center text-gray-500">No products found.</div>}
      </div>
    </div>
  );
};

export default AdminProducts;
