import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold text-white tracking-tight">
              Pet<span className="text-amber-500">Hive</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Your one-stop destination for premium pet supplies. We care about your furry friends as much as you do.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-amber-500 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-amber-500 transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-amber-500 transition-colors">Shop All</Link></li>
              <li><Link to="/about" className="hover:text-amber-500 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-amber-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Categories</h4>
            <ul className="space-y-3">
              <li><Link to="/shop?category=dogs" className="hover:text-amber-500 transition-colors">Dogs</Link></li>
              <li><Link to="/shop?category=cats" className="hover:text-amber-500 transition-colors">Cats</Link></li>
              <li><Link to="/shop?category=birds" className="hover:text-amber-500 transition-colors">Birds</Link></li>
              <li><Link to="/shop?category=fish" className="hover:text-amber-500 transition-colors">Fish</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                <span>123 Pet Street, Animal Kingdom, PA 19000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span>hello@pethive.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-16 pt-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} PetHive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
