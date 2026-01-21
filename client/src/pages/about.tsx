import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="h-[50vh] relative flex items-center justify-center bg-black overflow-hidden">
        {/* Unsplash: Chef cooking with fire */}
        <img 
          src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop" 
          alt="Chef cooking"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-white uppercase mb-4"
          >
            Our Story
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-xl text-gray-300"
          >
            Born from a passion for spice and a love for authentic street food.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <p className="lead text-2xl font-serif text-center mb-12">
            "Heat Box started in a small food truck in 2015 with one mission: to bring serious heat to serious food lovers."
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="font-display text-3xl mb-4 text-primary uppercase">The Beginning</h2>
              <p className="text-muted-foreground">
                Founder Marco Rossi grew up surrounded by the spicy aromas of his grandmother's kitchen. Disappointed by the lack of genuinely spicy options in the city, he bought a second-hand truck and started experimenting with chili peppers from around the world.
              </p>
              <p className="text-muted-foreground mt-4">
                The result was a fusion of classic comfort foods—burgers, wings, pizza—elevated by complex, fiery sauces that didn't just burn, but added depth and soul.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl rotate-3 transform hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?q=80&w=1000&auto=format&fit=crop" 
                alt="Food Truck" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <Separator className="my-12" />

          <div className="text-center mb-16">
            <h2 className="font-display text-3xl mb-6 text-primary uppercase">Our Philosophy</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 border rounded-xl bg-secondary/5">
                <h3 className="font-bold text-xl mb-2">Freshness</h3>
                <p className="text-sm text-muted-foreground">We chop, dice, and grill daily. No freezers, no shortcuts.</p>
              </div>
              <div className="p-6 border rounded-xl bg-secondary/5">
                <h3 className="font-bold text-xl mb-2">Spice</h3>
                <p className="text-sm text-muted-foreground">From mild jalapeños to the ghost pepper, we respect the heat.</p>
              </div>
              <div className="p-6 border rounded-xl bg-secondary/5">
                <h3 className="font-bold text-xl mb-2">Community</h3>
                <p className="text-sm text-muted-foreground">Food brings people together. We support local farmers and charities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
