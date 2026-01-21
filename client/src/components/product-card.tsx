import { Product } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SpicyLevel } from "./ui/spicy-level";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const toggleCart = useCart((state) => state.toggleCart);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your order.`,
      duration: 1500,
    });
    // Optional: open cart immediately
    // toggleCart(); 
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50 backdrop-blur-sm flex flex-col group">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {product.isPopular && (
              <Badge className="bg-primary text-primary-foreground">Popular</Badge>
            )}
            {product.spicyLevel > 0 && (
              <div className="bg-black/70 p-1 rounded-full backdrop-blur-md">
                <SpicyLevel level={product.spicyLevel} />
              </div>
            )}
          </div>
        </div>
        
        <CardContent className="p-5 flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-display text-xl leading-tight">{product.name}</h3>
            <span className="font-bold text-lg text-primary">${product.price}</span>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {product.description}
          </p>
          <div className="flex gap-2 mt-auto pt-2">
            {product.isVegetarian && (
              <Badge variant="outline" className="text-xs border-green-500 text-green-600">Veg</Badge>
            )}
            {product.isGlutenFree && (
              <Badge variant="outline" className="text-xs border-amber-500 text-amber-600">GF</Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <Button 
            className="w-full font-bold group-hover:bg-primary/90" 
            size="lg"
            onClick={handleAddToCart}
          >
            <Plus className="w-4 h-4 mr-2" /> Add to Order
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
