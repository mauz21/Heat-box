import { useOrder } from "@/hooks/use-orders";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Package, ChefHat, Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const STEPS = [
  { id: "pending", label: "Order Received", icon: Package },
  { id: "preparing", label: "Preparing", icon: ChefHat },
  { id: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { id: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderTracking() {
  const { id } = useParams();
  const { data: order, isLoading, error } = useOrder(Number(id));

  if (isLoading) {
    return <div className="container mx-auto p-8"><Skeleton className="h-[400px] w-full rounded-xl" /></div>;
  }

  if (error || !order) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-destructive">Order not found</h2>
        <p>Please check your order ID and try again.</p>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex(s => s.id === order.status);
  const progressValue = ((currentStepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold uppercase mb-2">Track Order #{order.id}</h1>
          <p className="text-muted-foreground">Estimated Delivery: 30-40 mins</p>
        </div>

        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-secondary text-secondary-foreground pb-8">
             <div className="flex justify-between items-center">
               <CardTitle className="text-xl">Order Status</CardTitle>
               <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                 {order.status.replace(/_/g, " ")}
               </span>
             </div>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="relative mb-12 px-4">
              <Progress value={progressValue} className="h-2 mb-8" />
              <div className="flex justify-between relative">
                {STEPS.map((step, index) => {
                  const isActive = index <= currentStepIndex;
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex flex-col items-center absolute" style={{ 
                      left: `${(index / (STEPS.length - 1)) * 100}%`, 
                      transform: 'translateX(-50%)' 
                    }}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 mb-2 bg-background z-10 ${
                        isActive ? "border-primary text-primary" : "border-muted text-muted-foreground"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-bold text-center whitespace-nowrap ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="font-bold mb-4">Order Summary</h3>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x <span className="text-foreground">{item.product.name}</span>
                    </span>
                    <span className="font-medium">${(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${order.totalAmount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
