import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Plus, Trash2, Tag, Edit2, X, Save } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name) return;

    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, formData, { withCredentials: true });
      } else {
        await api.post('/admin/categories', formData, { withCredentials: true });
      }
      
      setFormData({ name: '', slug: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, slug: category.slug });
    setError('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '' });
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? Category must be empty.')) return;
    try {
      await api.delete(`/admin/categories/${id}`, { withCredentials: true });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete category');
    }
  };

  return (
    <div className="max-w-4xl">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="w-8 h-8 text-amber-500" />
            Categories
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <h3 className="text-lg font-bold mb-4 flex justify-between items-center">
                    {editingId ? 'Edit Category' : 'Add New Category'}
                    {editingId && (
                        <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </h3>
                {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input 
                            className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="e.g. Hamsters"
                            value={formData.name}
                            onChange={(e) => {
                                const name = e.target.value;
                                // Auto-slug only if adding new or if user hasn't manually touched slug (simplified: always auto for now unless distinct field)
                                // Let's keep distinct logic:
                                const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                setFormData({ name, slug });
                            }} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                        <input 
                            className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-500"
                            value={formData.slug}
                            readOnly // Keep readOnly for simplicity, derived from name
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={!formData.name}
                        className={`w-full text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 ${
                            editingId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-amber-500 hover:bg-amber-600 disabled:opacity-50'
                        }`}
                    >
                        {editingId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {editingId ? 'Update Category' : 'Create Category'}
                    </button>
                </form>
            </div>
        </div>

        {/* List */}
        <div className="md:col-span-2 space-y-3">
            {categories.map(cat => (
                <div 
                    key={cat.id} 
                    className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center transition-all ${
                        editingId === cat.id ? 'ring-2 ring-blue-500 border-transparent' : 'hover:border-amber-200'
                    }`}
                >
                    <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                             editingId === cat.id ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'
                         }`}>
                            {cat.name.charAt(0)}
                         </div>
                         <div>
                             <h4 className="font-bold text-gray-900">{cat.name}</h4>
                             <p className="text-xs text-gray-400">/{cat.slug}</p>
                         </div>
                    </div>
                    <div className="flex gap-2">
                         <button 
                            onClick={() => handleEdit(cat)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit Category"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => handleDelete(cat.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Category"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
            
            {categories.length === 0 && <div className="text-center text-gray-400 py-10">No categories found.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
