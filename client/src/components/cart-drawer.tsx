import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCreateOrder } from "@/hooks/use-orders";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const handleCheckout = async () => {
    try {
      // Basic checkout logic - assuming guest checkout or linked to user if logged in
      // In a real app, this would redirect to a checkout page with forms
      const orderData = {
        order: {
          userId: user ? user.id : null,
          totalAmount: total().toFixed(2),
          deliveryAddress: { street: "123 Test St", city: "Food City" }, // Mock data for now
          status: "pending",
        },
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const order = await createOrder.mutateAsync(orderData);
      
      clearCart();
      toggleCart();
      toast({
        title: "Order placed!",
        description: `Your order #${order.id} has been received.`,
      });
      setLocation(`/track/${order.id}`);
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 font-display text-2xl uppercase">
            <ShoppingBag className="w-6 h-6 text-primary" /> Your Order
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p>Your cart is empty</p>
              <Button variant="link" onClick={toggleCart}>Start Ordering</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm leading-tight line-clamp-2">{item.name}</h4>
                      <p className="text-primary font-mono text-sm mt-1">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-md h-8">
                        <button 
                          className="px-2 hover:bg-muted h-full"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          className="px-2 hover:bg-muted h-full"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        className="text-muted-foreground hover:text-destructive transition-colors ml-auto"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <div className="border-t pt-6 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>$5.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>Total</span>
                <span>${(total() + 5).toFixed(2)}</span>
              </div>
            </div>

            <Button 
              className="w-full text-lg font-bold py-6 bg-primary hover:bg-primary/90"
              onClick={handleCheckout}
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? "Processing..." : "Checkout"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
