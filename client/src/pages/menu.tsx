import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = ["All", "Burgers", "Pizzas", "Wings", "Sides", "Drinks"];

export default function Menu() {
  const [category, setCategory] = useState("All");
  const [spicyFilter, setSpicyFilter] = useState<string>("all");
  
  const { data: products, isLoading, error } = useProducts(
    category, 
    spicyFilter === "all" ? undefined : Number(spicyFilter)
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-secondary py-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        {/* Unsplash image: Pizza background */}
        <img 
          src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=2070&auto=format&fit=crop" 
          alt="Menu Header"
          className="absolute inset-0 w-full h-full object-cover opacity-30 -z-10"
        />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-display font-bold uppercase mb-4">Our Menu</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore our wide range of spicy delights, classic favorites, and refreshing sides.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  onClick={() => setCategory(cat)}
                  className="rounded-full whitespace-nowrap"
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Spicy Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-sm font-medium whitespace-nowrap">Heat Level:</span>
              <Select value={spicyFilter} onValueChange={setSpicyFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="0">Not Spicy</SelectItem>
                  <SelectItem value="1">Mild</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">Extra Hot</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive text-lg font-bold">Failed to load menu items.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl">
            <Flame className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
