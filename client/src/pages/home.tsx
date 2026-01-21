import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Flame, ChefHat, Timer, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";

export default function Home() {
  const { data: popularProducts } = useProducts();

  // Filter for popular items only
  const featuredItems = popularProducts?.filter(p => p.isPopular).slice(0, 3) || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0 z-0">
          {/* Unsplash image: Dark moody burger shot */}
          <img 
            src="https://images.unsplash.com/photo-1586190848861-99c8a3da799c?q=80&w=2070&auto=format&fit=crop" 
            alt="Delicious burger" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 backdrop-blur-md mb-6">
              <Flame className="w-4 h-4 fill-primary" />
              <span className="text-sm font-bold uppercase tracking-wider">The Hottest Taste in Town</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white uppercase leading-none mb-6">
              Taste the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Heat</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Experience bold flavors, spicy kicks, and chef-crafted meals delivered straight to your door. Warning: Highly addictive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/menu">
                <Button size="xl" className="text-lg h-14 px-8 font-display uppercase tracking-wider rounded-full hover:scale-105 transition-transform">
                  Order Now
                </Button>
              </Link>
              <Link href="/reservations">
                <Button variant="outline" size="xl" className="text-lg h-14 px-8 font-display uppercase tracking-wider rounded-full bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 hover:border-primary transition-all">
                  Book a Table
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ChefHat, title: "Chef Crafted", desc: "Recipes curated by award-winning chefs using premium ingredients." },
              { icon: Timer, title: "Fast Delivery", desc: "Hot and fresh to your door in under 30 minutes, guaranteed." },
              { icon: Star, title: "Quality First", desc: "Locally sourced produce and hormone-free meats." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-display mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-display mb-2">Fan Favorites</h2>
              <p className="text-muted-foreground">The dishes everyone is talking about.</p>
            </div>
            <Link href="/menu">
              <Button variant="ghost" className="hidden md:flex group">
                View Full Menu <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link href="/menu">
              <Button className="w-full">View Full Menu</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Hungry Yet?</h2>
          <p className="text-xl md:text-2xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join our loyalty program and get free spicy wings on your first order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button size="xl" variant="secondary" className="font-display uppercase tracking-wider">Start Order</Button>
            </Link>
            <Button size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-display uppercase tracking-wider">
              Join Rewards
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
