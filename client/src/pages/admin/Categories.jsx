import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Plus, Trash2, Tag, Edit2, X, Save, Search, Hash, Loader2, AlertCircle } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBtnLoading(true);
    
    if (!formData.name) return;

    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, formData);
      } else {
        await api.post('/admin/categories', formData);
      }
      
      setFormData({ name: '', slug: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    } finally {
      setBtnLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, slug: category.slug });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '' });
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? This will affect products assigned to it.')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete category');
    }
  };

  if (loading && categories.length === 0) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase">
            <Tag className="w-8 h-8 text-amber-500" />
            Classifications
          </h2>
          <p className="text-slate-500 font-medium mt-1">Organize your shop by pet types or item types.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Creation Form */}
        <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 md:sticky md:top-24">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                      {editingId ? 'Modify Details' : 'Design New Tag'}
                  </h3>
                  {editingId && (
                      <button onClick={handleCancel} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-500 transition-colors">
                          <X className="w-5 h-5" />
                      </button>
                  )}
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-in bounce-in">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-2 font-black">Display Name</label>
                        <input 
                            required
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                            placeholder="e.g. Exotic Birds"
                            value={formData.name}
                            onChange={(e) => {
                                const name = e.target.value;
                                const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                setFormData({ name, slug });
                            }} 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-2 font-black">URL Slug</label>
                        <div className="relative">
                          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input 
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-10 text-slate-400 font-bold outline-none cursor-not-allowed"
                              value={formData.slug}
                              readOnly 
                          />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={!formData.name || btnLoading}
                        className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group ${
                            editingId ? 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700' : 'bg-slate-900 shadow-slate-100 hover:bg-amber-500 disabled:opacity-50'
                        }`}
                    >
                        {btnLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            {editingId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />}
                            {editingId ? 'UPDATE CLASS' : 'CREATE CLASS'}
                          </>
                        )}
                    </button>
                </form>
            </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map(cat => (
                  <div 
                      key={cat.id} 
                      className={`group bg-white p-6 rounded-[2rem] shadow-sm border transition-all duration-300 flex items-center justify-between ${
                          editingId === cat.id ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-100 hover:border-amber-200 hover:shadow-xl hover:shadow-slate-100'
                      }`}
                  >
                      <div className="flex items-center gap-5">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-colors ${
                               editingId === cat.id ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500'
                           }`}>
                              {cat.name.charAt(0).toUpperCase()}
                           </div>
                           <div>
                               <h4 className="font-black text-slate-900 uppercase tracking-tight line-clamp-1">{cat.name}</h4>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">/{cat.slug}</p>
                           </div>
                      </div>
                      <div className="flex gap-2">
                           <button 
                              onClick={() => handleEdit(cat)}
                              className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
                              title="Edit"
                          >
                              <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                              onClick={() => handleDelete(cat.id)}
                              className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                              title="Delete"
                          >
                              <Trash2 className="w-5 h-5" />
                          </button>
                      </div>
                  </div>
              ))}
            </div>
            
            {categories.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <Tag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-900">No Classifications</h3>
                <p className="text-slate-400 font-medium">Create your first category to start organizing.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
