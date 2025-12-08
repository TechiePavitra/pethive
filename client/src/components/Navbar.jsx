import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { cart, setIsOpen } = useCart();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-light/20 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-heading font-black text-primary tracking-tight">
          Pet<span className="text-secondary">Hive</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Home</Link>
          <Link to="/shop" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Shop</Link>
          <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2.5 hover:bg-accent rounded-full relative transition-colors group"
          >
            <ShoppingCart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-secondary text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
          
          <Link 
            to={user ? (user.role === 'admin' ? '/admin' : '/checkout/success') : '/login'} 
            className="p-2.5 hover:bg-accent rounded-full transition-colors group"
          >
            <User className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2.5 hover:bg-accent rounded-full transition-colors"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-light/20 overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              <Link 
                to="/" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
