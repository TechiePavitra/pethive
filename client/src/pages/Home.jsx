import { useEffect, useState } from 'react';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/products')
      .then(res => {
        // Handle both old format (array) and new format (object with products array)
        const productsData = Array.isArray(res.data) ? res.data : res.data.products;
        setProducts(productsData.slice(0, 4)); // Show top 4
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load products. Please make sure the backend server is running.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Helmet>
        <title>PetHive - Premium Pet Supplies</title>
        <meta name="description" content="Shop the best pet food, toys, and accessories for your furry friends. Quality guaranteed at PetHive." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-900">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800/30 -skew-x-12 translate-x-20"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-start md:items-center relative z-20 pt-32 md:pt-16">
          <div 
            className="text-white space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700 text-amber-400 text-sm font-medium">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>Rated #1 Pet Shop of 2024</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-black leading-tight tracking-tight mt-4 !text-white">
              Giving Your Pets <br />
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Royal Treatment</span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-lg leading-relaxed font-light">
              Premium nutrition, durable gear, and interactive toys. Everything your furry companion needs to live their best life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg px-8 py-4 h-auto rounded-full shadow-lg shadow-amber-500/20 w-full sm:w-auto">
                  Shop Collection
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="ghost" className="text-white border border-slate-700 hover:bg-slate-800 font-medium text-lg px-8 py-4 h-auto rounded-full w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="pt-8 flex gap-8 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-500">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">Free Shipping</div>
                  <div className="text-xs text-slate-400">On orders over $50</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">Quality Guarantee</div>
                  <div className="text-xs text-slate-400">30-day returns</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image / Composition */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800/50">
              <img 
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800"
                alt="Happy dogs running" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating Card Element */}
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: -20 }}
              transition={{ repeat: Infinity, duration: 4, repeatType: 'reverse', ease: 'easeInOut' }}
              className="absolute -bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl z-20 max-w-xs border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">JD</div>
                <div>
                  <div className="text-sm font-bold text-slate-900">John Doe</div>
                  <div className="text-xs text-slate-500">Verified Buyer</div>
                </div>
              </div>
              <p className="text-sm text-slate-600">"My golden retriever emphasizes loves the new organic treats! Fast delivery too."</p>
              <div className="flex text-amber-500 mt-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 px-4 container mx-auto bg-white">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-amber-600 font-bold tracking-wider uppercase text-sm">Browse by Category</span>
          <h2 className="text-4xl font-heading font-bold text-slate-900 mt-2 mb-4">Everything Your Pet Needs</h2>
          <p className="text-slate-600">We've curated the best products for every type of pet. Find exactly what you're looking for.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Dogs', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=500&q=80', count: '120+ Items' },
            { name: 'Cats', img: 'https://images.unsplash.com/photo-1519052537078-e6302a4968ef?auto=format&fit=crop&w=500&q=80', count: '85+ Items' },
            { name: 'Birds', img: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=500&q=80', count: '30+ Items' },
            { name: 'Fish', img: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=500&q=80', count: '50+ Items' }
          ].map((cat, idx) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white p-2">
                <h3 className="text-3xl font-heading font-bold mb-1 group-hover:text-amber-400 transition-colors">{cat.name}</h3>
                <p className="text-slate-300 text-sm mb-4">{cat.count}</p>
                <div className="flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">Trending Now</h2>
              <p className="text-muted-foreground">Customer favorites chosen just for you.</p>
            </div>
            <Link to="/shop">
              <Button variant="ghost" className="font-semibold group hover:bg-white hover:shadow-md">
                View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, idx) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-2">{error}</p>
              <p className="text-sm text-gray-500">Please enable the backend server.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
