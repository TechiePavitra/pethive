import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Users, TrendingUp, RefreshCcw, Package, Calendar } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
    </div>
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/20">
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-amber-600 text-lg font-bold">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const fetchStats = async (range = timeRange) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/stats?range=${range}`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await api.post('/admin/reset-stats');
      setShowConfirmReset(false);
      fetchStats(); // Refresh data
    } catch (error) {
       console.error('Reset failed:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const ranges = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
  ];

  if (loading && !stats) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analytics Dashboard</h2>
          <p className="text-gray-500 text-lg">Visualizing your growth and sales performance.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            <RefreshCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            Reset Sales
          </button>
          
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
            {ranges.map((r) => (
              <button
                key={r.id}
                onClick={() => setTimeRange(r.id)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  timeRange === r.id 
                    ? 'bg-white text-amber-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats?.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          icon={DollarSign} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Completed Orders" 
          value={stats?.totalOrders} 
          icon={ShoppingCart} 
          color="bg-sky-500" 
        />
        <StatCard 
          title="Active Customers" 
          value={stats?.totalUsers} 
          icon={Users} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Store Inventory" 
          value={stats?.totalProducts} 
          icon={Package} 
          color="bg-amber-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Sales Performance
            </h3>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <Calendar className="w-4 h-4" />
              Viewing {timeRange}
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.salesHistory}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#f59e0b" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Top Sellers</h3>
          <div className="space-y-6">
            {stats?.topSelling.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors uppercase text-sm tracking-tight">{product.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">Monthly Sales Capacity</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    {product.sales} sold
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 mx-auto">
              <RefreshCcw className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Reset All Sales?</h3>
            <p className="text-gray-500 text-center mb-8">This will clear the current analytics report. This action cannot be undone.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleReset}
                disabled={isResetting}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-colors disabled:opacity-50"
              >
                {isResetting ? 'Resetting...' : 'Yes, Reset Now'}
              </button>
              <button 
                onClick={() => setShowConfirmReset(false)}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
