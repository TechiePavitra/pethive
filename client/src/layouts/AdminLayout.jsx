import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, MessageSquare, LogOut, Package, Tag, Menu, X } from 'lucide-react';
import api from '../lib/api';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simple check if admin
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        const user = res.data.user;
        
        if (!user || user.role !== 'admin') {
          navigate('/login');
          return;
        }
        setLoading(false);
      } catch (err) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {});
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/products", icon: ShoppingBag, label: "Products" },
    { to: "/admin/chat", icon: MessageSquare, label: "Customer Chat" },
    { to: "/admin/categories", icon: Tag, label: "Categories" },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
  </div>;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 z-[60] shadow-sm">
        <h1 className="text-xl font-bold text-amber-500 flex items-center gap-2">
          <Package className="w-6 h-6" />
          PetHive Admin
        </h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[80] w-72 bg-white shadow-2xl transition-transform duration-300 transform 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:z-50 lg:shadow-xl
      `}>
        <div className="p-8 border-b border-slate-50">
          <h1 className="text-2xl font-black text-amber-500 flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-xl">
              <Package className="w-8 h-8" />
            </div>
            <span>PetHive</span>
          </h1>
        </div>
        
        <nav className="p-6 space-y-3">
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              end={item.end}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-amber-500 text-white font-bold shadow-lg shadow-amber-200 scale-[1.02]' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 text-rose-500 hover:bg-rose-50 w-full rounded-2xl transition-all duration-200 font-bold"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full lg:min-h-screen pt-20 lg:pt-0">
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
