import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { Helmet } from 'react-helmet-async';
import { parseImages } from '../lib/parseImages';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  const images = parseImages(product.images);
  const image = images[0] || 'https://via.placeholder.com/600';

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{product.name} - One Stop Pet Shop</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img src={image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="mb-6">
            {product.discount > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-secondary">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                <span className="text-xl text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">-{product.discount}% OFF</span>
              </div>
            ) : (
              <div className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</div>
            )}
            {product.isOffer && (
              <div className="inline-block mt-2 bg-secondary/10 text-secondary text-sm font-bold px-3 py-1 rounded-full">
                Special Offer
              </div>
            )}
          </div>
          <p className="text-gray-600 mb-8">{product.description}</p>
          
          <div className="flex gap-4">
            <Button size="lg" onClick={() => addToCart(product)}>
              Add to Cart
            </Button>
          </div>
          
          <div className="mt-8 pt-8 border-t">
            <div className="text-sm text-gray-500">
              <p>Category: {product.category?.name}</p>
              <p>Stock: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
