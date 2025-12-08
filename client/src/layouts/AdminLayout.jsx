import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, MessageSquare, LogOut, Package, Tag } from 'lucide-react';
import axios from 'axios';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simple check if admin
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/auth/me', { withCredentials: true });
        if (res.data.user.role !== 'admin') {
          navigate('/');
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
      await axios.post('http://localhost:3001/api/auth/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl fixed inset-y-0 left-0 z-50">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
            <Package className="w-8 h-8" />
            Admin
          </h1>
        </div>
        
        <nav className="p-4 space-y-2">
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? 'bg-amber-50 text-amber-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>

          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? 'bg-amber-50 text-amber-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <ShoppingBag className="w-5 h-5" />
            Products
          </NavLink>

          <NavLink 
            to="/admin/chat" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? 'bg-amber-50 text-amber-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <MessageSquare className="w-5 h-5" />
            Customer Chat
          </NavLink>

          <NavLink 
            to="/admin/categories" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? 'bg-amber-50 text-amber-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Tag className="w-5 h-5" />
            Categories
          </NavLink>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
