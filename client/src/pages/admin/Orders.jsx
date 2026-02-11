import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Package, Truck, CheckCircle, RefreshCcw, User, Calendar, DollarSign, ChevronRight, Loader2, Search, Filter, Hash } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}`, { status });
      // Instant UI update for better feel
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      case 'returned': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'pending': return 'bg-amber-100 text-amber-600 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'shipped': return <Truck className="w-3.5 h-3.5" />;
      case 'returned': return <RefreshCcw className="w-3.5 h-3.5" />;
      default: return <Package className="w-3.5 h-3.5" />;
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (o.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && orders.length === 0) return (
    <div className="min-h-[400px] flex items-center justify-center">
       <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Order Logistics</h2>
          <p className="text-slate-500 font-medium">Track and fulfill customer purchases.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
           <div className="px-4 py-2 bg-white rounded-xl shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400">Total: {orders.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search by ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-slate-700 shadow-sm"
          />
        </div>
        <div className="relative flex-1 md:max-w-xs group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-slate-700 shadow-sm appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Transaction</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Customer</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Valuation</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Current Phase</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(order => (
                <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-white group-hover:border-amber-200 transition-colors">
                          <Hash className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-900 font-mono tracking-tighter uppercase">{order.id.slice(0, 12)}</p>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 mt-0.5 uppercase">
                             <Calendar className="w-3 h-3" />
                             {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center">
                           <User className="w-4 h-4" />
                        </div>
                        <span className="font-extrabold text-slate-700 text-sm">{order.user?.name || order.user?.email || 'Guest'}</span>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-1 font-black text-slate-900 text-lg">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        {order.total.toFixed(2)}
                     </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusStyle(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="relative inline-block group/select">
                      <select
                        className="appearance-none bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 pr-10 text-[10px] font-black uppercase tracking-widest text-slate-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all cursor-pointer hover:bg-white"
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="returned">Returned</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none group-hover/select:text-amber-500 transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
                <Truck className="w-10 h-10" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900 uppercase">No Logistics Found</h3>
                <p className="text-slate-400 font-medium">Clear your filters to view all orders.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
