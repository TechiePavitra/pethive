import { useCart } from '../context/CartContext';
import Button from './Button';
import { X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { parseImages } from '../lib/parseImages';

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, total, isOpen, setIsOpen, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      await api.post('/orders', {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price
        })),
        total
      });
      clearCart();
      setIsOpen(false);
      navigate('/checkout/success');
    } catch (error) {
      alert('Checkout failed. Please login first.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            <div className="p-4 flex items-center justify-between border-b">
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-12">Your cart is empty</div>
              ) : (
                cart.map(item => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={parseImages(item.product.images)[0] || 'https://via.placeholder.com/150'} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <div className="text-sm text-gray-500">${item.product.price.toFixed(2)}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.productId)}
                          className="ml-auto text-red-500 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
              </div>
              <Button 
                className="w-full" 
                size="lg" 
                disabled={cart.length === 0}
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
