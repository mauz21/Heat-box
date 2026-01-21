import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReservationSchema, type InsertReservation } from "@shared/schema";
import { useCreateReservation } from "@/hooks/use-reservations";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, AlignLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Reservations() {
  const createReservation = useCreateReservation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<InsertReservation>({
    resolver: zodResolver(insertReservationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: 2,
      specialRequests: "",
    },
  });

  const onSubmit = (data: InsertReservation) => {
    createReservation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Table Reserved!",
          description: "We'll see you soon. A confirmation email has been sent.",
        });
        form.reset();
        setLocation("/");
      },
      onError: (error) => {
        toast({
          title: "Reservation Failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          <div className="space-y-6">
            <h1 className="text-4xl font-display font-bold uppercase text-primary">Book a Table</h1>
            <p className="text-muted-foreground text-lg">
              Reserve your spot at Heat Box and prepare for a flavor explosion. We recommend booking at least 24 hours in advance for weekends.
            </p>
            
            <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
              <h3 className="font-bold flex items-center gap-2"><Clock className="w-5 h-5 text-primary"/> Opening Hours</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Mon - Thu</p>
                  <p className="text-muted-foreground">11:00 AM - 10:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold">Fri - Sat</p>
                  <p className="text-muted-foreground">11:00 AM - 11:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold">Sunday</p>
                  <p className="text-muted-foreground">12:00 PM - 9:30 PM</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="shadow-lg border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle>Reservation Details</CardTitle>
              <CardDescription>Fill out the form below to secure your table.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="date" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guests</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type="number" 
                                min="1" 
                                max="20" 
                                className="pl-9" 
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="time" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea 
                              placeholder="Allergies, high chair needed, etc." 
                              className="pl-9 min-h-[100px]" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={createReservation.isPending}>
                    {createReservation.isPending ? "Booking..." : "Confirm Reservation"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
