import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { ShoppingBag, Menu, User, MapPin, Calendar, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { items, toggleCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className={`text-sm font-semibold uppercase tracking-wider transition-colors hover:text-primary ${location === href ? 'text-primary' : 'text-foreground'}`}>
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center transform rotate-3">
             <span className="text-primary-foreground font-display font-bold text-lg">H</span>
          </div>
          <span className="font-display font-bold text-2xl uppercase tracking-tighter">
            Heat<span className="text-primary">Box</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/menu">Menu</NavLink>
          <NavLink href="/locations">Locations</NavLink>
          <NavLink href="/reservations">Reservations</NavLink>
          <NavLink href="/about">About</NavLink>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt={user.firstName || 'User'} className="w-8 h-8 rounded-full border border-border" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Hey, {user?.firstName || 'Guest'}!</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/rewards">
                    <span className="w-full cursor-pointer">Rewards & Loyalty</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/reservations">
                    <span className="w-full cursor-pointer">My Reservations</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" className="hidden md:flex font-semibold" onClick={() => window.location.href = '/api/login'}>
              Log In
            </Button>
          )}

          <Button 
            variant="default" 
            size="icon" 
            className="relative rounded-full"
            onClick={toggleCart}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white border-2 border-background">
                {cartCount}
              </span>
            )}
          </Button>

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-display font-bold uppercase">Home</Link>
                <Link href="/menu" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-display font-bold uppercase">Menu</Link>
                <Link href="/locations" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-display font-bold uppercase">Locations</Link>
                <Link href="/reservations" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-display font-bold uppercase">Reservations</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-display font-bold uppercase">About Us</Link>
                
                {!isAuthenticated && (
                   <Button className="mt-4 w-full" onClick={() => window.location.href = '/api/login'}>Log In</Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
