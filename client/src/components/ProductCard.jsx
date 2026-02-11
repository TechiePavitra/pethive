import { Link } from 'react-router-dom';
import Button from './Button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { parseImages } from '../lib/parseImages';

export default function ProductCard({ product }) {
  const images = parseImages(product.images);
  
  const image = images[0] || 'https://via.placeholder.com/300';
  const { addToCart } = useCart();

  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-100">
      <div className="aspect-square w-full overflow-hidden bg-slate-50 relative">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isOffer && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Featured
            </span>
          )}
          {discount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent">
           {/* Add to cart functionality could be added here directly if desired */}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors line-clamp-1">
          <Link to={`/products/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {discount > 0 ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-900">${(price * (1 - discount / 100)).toFixed(2)}</span>
                <span className="text-xs text-slate-400 line-through">${price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-slate-900">${price.toFixed(2)}</span>
            )}
          </div>
          <Button 
            size="sm" 
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-slate-100 hover:bg-amber-500 text-slate-900 hover:text-white transition-all shadow-none hover:shadow-md z-10 relative"
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation
              addToCart(product);
            }}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
