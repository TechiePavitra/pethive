import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Award, Users, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Helmet>
        <title>About PetHive - Our Story</title>
        <meta name="description" content="Learn about PetHive's mission to provide premium pet supplies and royal treatment for your furry friends." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800/30 -skew-x-12 translate-x-20"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-4 block">Our Story</span>
            <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-6 leading-tight">
              We Believe Every Pet Deserves the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Royal Treatment</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed font-light">
              Founded on the simple premise that pets are family, PetHive has grown into the premier destination for discerning pet parents who want nothing but the best.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=1000" 
                  alt="Dog receiving affection" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-amber-500 text-white p-8 rounded-2xl shadow-xl hidden md:block">
                <div className="text-4xl font-black mb-1">10k+</div>
                <div className="text-sm font-medium">Happy Tails Wagging</div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">More Than Just a Store</h2>
                <div className="space-y-6 text-slate-600">
                  <p>
                    At PetHive, we curate our collection with obsessive care. We don&apos;t just sell products; we solve problems for pet parents. From organic nutrition to durable toys designed for heavy chewers, every item passes our rigorous &quot;tail wag&quot; test.
                  </p>
                  <p>
                    Our journey began when we couldn&apos;t find quality supplies for our own pets that matched our modern aesthetic and quality standards. So, we built the store we wished existed.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: ShieldCheck, title: "Quality First", desc: "Rigorous testing on all products" },
                  { icon: Heart, title: "Love Driven", desc: "Portion of profits to shelters" },
                  { icon: Sparkles, title: "Innovation", desc: "Latest in pet tech & design" },
                  { icon: Users, title: "Community", desc: "Join thousands of pet lovers" }
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{feature.title}</h3>
                      <p className="text-sm text-slate-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team/Values Section */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-heading font-bold text-slate-900 mb-12">Driven by Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Transparency", desc: "We are open about our sourcing and ingredients. No hidden nasties, ever." },
              { title: "Sustainability", desc: "We strive to minimize our pawprint with eco-friendly packaging and products." },
              { title: "Empathy", desc: "We understand the bond you share with your pet because we share it too." }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100"
              >
                <div className="w-14 h-14 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center mx-auto mb-6">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 container mx-auto">
        <div className="bg-amber-500 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-white">Ready to spoil your best friend?</h2>
            <p className="text-amber-100 text-xl">Join the hive and discover the difference quality makes.</p>
            <button 
              onClick={() => window.location.href = '/shop'}
              className="bg-white text-amber-600 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
