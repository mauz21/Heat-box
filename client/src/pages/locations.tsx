import { useLocations } from "@/hooks/use-locations";
import { LocationsMap } from "@/components/locations-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Locations() {
  const { data: locations, isLoading } = useLocations();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1 flex flex-col">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase mb-4">Find Us</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Visit one of our Heat Box locations for a dine-in experience or pick up your order hot and fresh.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px] flex-1">
          {/* List */}
          <div className="space-y-4 overflow-y-auto pr-2 h-full">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))
            ) : locations?.map((loc) => (
              <Card key={loc.id} className="hover:border-primary transition-colors cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span className="text-xl font-display">{loc.name}</span>
                    <MapPin className="text-primary w-5 h-5 group-hover:scale-110 transition-transform" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <p>{loc.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                    <p>{loc.phone}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="whitespace-pre-line">{loc.hours}</p>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">Get Directions</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map */}
          <div className="lg:col-span-2 rounded-xl overflow-hidden border shadow-lg h-[400px] lg:h-full relative">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <LocationsMap locations={locations || []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
