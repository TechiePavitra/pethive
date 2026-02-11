import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Plus, Trash2, Edit2, X, Search, Filter, Loader2, Package, Tag, DollarSign, Archive } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Drawer/Modal State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', categoryId: '', 
    stock: '', images: '', discount: '0', isOffer: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      const productsData = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.products;
      setProducts(productsData);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Error loading data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this item from inventory?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    let imageUrl = '';
    try {
        const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
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
        discount: product.discount || 0,
        isOffer: product.isOffer || false
      });
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, formData);
      } else {
        await api.post('/admin/products', formData);
      }
      
      setIsDrawerOpen(false);
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', categoryId: '', stock: '', images: '', discount: '0', isOffer: false });
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || p.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading && products.length === 0) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Inventory Management</h2>
          <p className="text-slate-500 font-medium">Add, update, and manage your pet products.</p>
        </div>
        <button 
          onClick={() => { 
            setIsDrawerOpen(true); 
            setEditingId(null); 
            setFormData({ name: '', description: '', price: '', categoryId: categories[0]?.id || '', stock: '', images: '', discount: '0', isOffer: false }); 
          }}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-amber-200 active:scale-95 group"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          ADD PRODUCT
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-medium text-slate-700 shadow-sm"
          />
        </div>
        <div className="relative flex-1 md:max-w-xs group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-medium text-slate-700 shadow-sm appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Product Info</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Price & Stock</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(product => {
                let img = '';
                try { 
                  const p = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                  img = Array.isArray(p) ? p[0] : p; 
                } catch(e) { img = product.images; }
                
                return (
                  <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 shrink-0">
                          <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight line-clamp-1">{product.name}</h4>
                          <p className="text-slate-400 text-xs font-medium mt-1 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black uppercase tracking-tight">
                        <Tag className="w-3 h-3" />
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-black text-slate-900">
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                          {product.price.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
                          <Archive className="w-3 h-3" />
                          {product.stock} in stock
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-wrap gap-2">
                        {product.isOffer && (
                          <span className="px-2 py-1 bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest">OFFER</span>
                        )}
                        {product.discount > 0 && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">-{product.discount}%</span>
                        )}
                        {!product.isOffer && product.discount === 0 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">NORMAL</span>
                        )}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-sm active:scale-95"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="px-8 py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
              <Package className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">No Inventory Found</h3>
              <p className="text-slate-400 font-medium">Try adjusting your filters or add a new product.</p>
            </div>
            <button 
              onClick={() => { setIsDrawerOpen(true); setEditingId(null); }}
              className="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-amber-500 transition-colors uppercase tracking-tight text-xs"
            >
              Add First Product
            </button>
          </div>
        )}
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsDrawerOpen(false)} />
          
          <div className="relative w-full max-w-xl bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            {/* Drawer Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                  {editingId ? 'Update Inventory' : 'Add to Stock'}
                </h3>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Product Details</p>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-2">Item Name</label>
                  <input 
                    required 
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Premium Dog Kibble"
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-amber-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-2">Detailed Description</label>
                  <textarea 
                    required 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="What makes this product special?"
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-amber-500 outline-none transition-all font-bold text-slate-700 min-h-[120px] resize-none placeholder:text-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-2">Price (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required 
                        type="number" step="0.01"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        className="w-full pl-10 pr-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-amber-500 outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-2">In Stock</label>
                    <div className="relative">
                      <Archive className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required 
                        type="number"
                        value={formData.stock}
                        onChange={e => setFormData({...formData, stock: e.target.value})}
                        className="w-full pl-10 pr-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-amber-500 outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-2">Category Assignment</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select 
                      required
                      value={formData.categoryId}
                      onChange={e => setFormData({...formData, categoryId: e.target.value})}
                      className="w-full pl-10 pr-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-amber-500 outline-none transition-all font-bold text-slate-700 appearance-none shadow-sm"
                    >
                      <option value="">Select a Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-2">Product Image (URL)</label>
                  <input 
                    required 
                    type="text"
                    value={formData.images}
                    onChange={e => setFormData({...formData, images: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-amber-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  />
                  {formData.images && (
                    <div className="mt-4 w-full h-40 rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 p-2">
                       <img src={formData.images} alt="Preview" className="w-full h-full object-cover rounded-2xl shadow-inner shadow-slate-200" />
                    </div>
                  )}
                </div>

                <div className="bg-amber-50/50 p-8 rounded-3xl border border-amber-100/50 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-amber-900 text-sm uppercase tracking-tight">Special Offer</h4>
                      <p className="text-amber-600 text-[10px] font-bold uppercase tracking-widest">Flash sale or promo label</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.isOffer}
                        onChange={e => setFormData({...formData, isOffer: e.target.checked})}
                      />
                      <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-amber-700 ml-1 block mb-2">Discount Percentage (%)</label>
                    <input 
                      type="number"
                      value={formData.discount}
                      onChange={e => setFormData({...formData, discount: e.target.value})}
                      className="w-full px-5 py-4 bg-white rounded-2xl border border-amber-100 focus:border-amber-500 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 flex flex-col gap-3 pb-12">
                <button 
                  type="submit" 
                  disabled={formLoading}
                  className="w-full py-5 bg-slate-900 hover:bg-amber-500 text-white font-black text-lg rounded-[2rem] transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {formLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    editingId ? 'CONFIRM CHANGES' : 'PUBLISH PRODUCT'
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-5 bg-white text-slate-400 border border-slate-100 hover:bg-slate-50 font-black rounded-[2rem] transition-all"
                >
                  DISCARD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
