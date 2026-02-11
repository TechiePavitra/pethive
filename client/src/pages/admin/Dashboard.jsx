import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Users, TrendingUp, RefreshCcw, Package, Calendar, Palette } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label, color }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-100">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-lg font-black`} style={{ color }}>
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
  const [chartColor, setChartColor] = useState('#f59e0b'); // Default Amber
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const colors = [
    { name: 'Amber', hex: '#f59e0b', bg: 'bg-amber-500' },
    { name: 'Emerald', hex: '#10b981', bg: 'bg-emerald-500' },
    { name: 'Rose', hex: '#f43f5e', bg: 'bg-rose-500' },
    { name: 'Blue', hex: '#0ea5e9', bg: 'bg-sky-500' },
  ];

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
      fetchStats();
    } catch (error) {
       console.error('Reset failed:', error);
    } finally {
      setIsResetting(false);
    }
  };

  if (loading && !stats) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Analytics Overview</h2>
          <p className="text-slate-500 font-medium text-lg mt-1">Monitor your store's performance & growth.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Color Selector */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <Palette className="w-4 h-4 text-slate-400 ml-1" />
            <div className="flex items-center gap-1.5 px-2">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setChartColor(c.hex)}
                  className={`w-6 h-6 rounded-full transition-all ring-offset-2 ${
                    chartColor === c.hex ? 'ring-2 scale-110 shadow-lg' : 'hover:scale-110 opacity-70'
                  } ${c.bg}`}
                  style={{ ringColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Time Selector */}
          <div className="bg-slate-50 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-100">
            {['day', 'week', 'month', 'year'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-4 py-2 text-sm font-black rounded-xl transition-all uppercase tracking-tighter ${
                  timeRange === r 
                    ? 'bg-white text-slate-900 shadow-md scale-105' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-tighter text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-2xl transition-all active:scale-95"
          >
            <RefreshCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            Reset
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Revenue" 
          value={`$${stats?.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          icon={DollarSign} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Orders" 
          value={stats?.totalOrders} 
          icon={ShoppingCart} 
          color="bg-sky-500" 
        />
        <StatCard 
          title="Users" 
          value={stats?.totalUsers} 
          icon={Users} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Products" 
          value={stats?.totalProducts} 
          icon={Package} 
          color="bg-amber-500" 
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="w-2 h-8 rounded-full" style={{ backgroundColor: chartColor }}></div>
              Sales Performance
            </h3>
            <div className="hidden sm:flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
              <Calendar className="w-4 h-4" />
              Viewing {timeRange}
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.salesHistory}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 700 }} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 700 }} 
                />
                <Tooltip content={<CustomTooltip color={chartColor} />} />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke={chartColor} 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-xl font-black text-slate-900 mb-8 px-2 flex items-center justify-between">
            Top Sellers
            <TrendingUp className="w-5 h-5 text-slate-300" />
          </h3>
          <div className="space-y-4 flex-1">
            {stats?.topSelling.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-900 flex items-center justify-center font-black group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-wider leading-relaxed">{product.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{product.sales} Units Sold</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center mb-8 mx-auto rotate-12">
              <RefreshCcw className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-3xl font-black text-center text-slate-900 mb-4 tracking-tighter">Wipe Data?</h3>
            <p className="text-slate-500 text-center mb-10 font-medium">This will clear your entire sales history report. This action is permanent.</p>
            <div className="space-y-3">
              <button 
                onClick={handleReset}
                disabled={isResetting}
                className="w-full py-5 bg-rose-600 hover:bg-rose-700 text-white font-black text-lg rounded-2xl transition-all shadow-lg shadow-rose-200 active:scale-95 disabled:opacity-50"
              >
                {isResetting ? 'Wiping...' : 'YES, RESET DATA'}
              </button>
              <button 
                onClick={() => setShowConfirmReset(false)}
                className="w-full py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all active:scale-95"
              >
                BACK TO SAFETY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
