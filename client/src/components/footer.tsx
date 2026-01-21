import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
               <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center transform rotate-3">
                 <span className="text-primary-foreground font-display font-bold text-lg">H</span>
              </div>
              <span className="font-display font-bold text-2xl uppercase tracking-tighter text-white">
                Heat<span className="text-primary">Box</span>
              </span>
            </Link>
            <p className="text-muted-foreground">
              Bringing the heat to your doorstep. Authentic flavors, spicy kicks, and unforgettable meals.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 text-white">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/menu" className="hover:text-primary transition-colors">Full Menu</Link></li>
              <li><Link href="/locations" className="hover:text-primary transition-colors">Our Locations</Link></li>
              <li><Link href="/reservations" className="hover:text-primary transition-colors">Book a Table</Link></li>
              <li><Link href="/rewards" className="hover:text-primary transition-colors">Heat Rewards</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 text-white">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Heat Box Restaurants. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
