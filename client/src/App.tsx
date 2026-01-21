import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/home";
import Menu from "@/pages/menu";
import Locations from "@/pages/locations";
import Reservations from "@/pages/reservations";
import OrderTracking from "@/pages/order-tracking";
import Rewards from "@/pages/rewards";
import About from "@/pages/about";
import { useAuth } from "@/hooks/use-auth";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      <Route path="/locations" component={Locations} />
      <Route path="/reservations" component={Reservations} />
      <Route path="/track/:id" component={OrderTracking} />
      <Route path="/about" component={About} />
      
      {/* Protected Routes */}
      <Route path="/rewards">
        {() => {
          if (isLoading) return null;
          if (!isAuthenticated) {
            window.location.href = "/api/login";
            return null;
          }
          return <Rewards />;
        }}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
          <CartDrawer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
