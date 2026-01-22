import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { insertProductSchema, insertLocationSchema } from "@shared/schema";

async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    const products = [
      {
        name: "Diamond Crust Pizza",
        description: "Signature spicy stuffed crust with triple-layered premium pepperoni and melt-in-your-mouth mozzarella.",
        price: "1850.00",
        category: "Pizzas",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
        spicyLevel: 2,
        isPopular: true,
      },
      {
        name: "Zinger Burger",
        description: "Hand-breaded crispy chicken fillet, toasted sesame bun, and our top-secret spicy mayo infusion.",
        price: "650.00",
        category: "Burgers",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        spicyLevel: 1,
        isPopular: true,
      },
      {
        name: "Atomic Wings",
        description: "8 jumbo wings flame-grilled and tossed in our secret atomic sauce. Served with cool yogurt dip.",
        price: "950.00",
        category: "Wings",
        imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f",
        spicyLevel: 3,
        isPopular: true,
      },
      {
        name: "Veggie Delight",
        description: "Fresh bell peppers, onions, mushrooms, and black olives on a crispy crust.",
        price: "1450.00",
        category: "Pizzas",
        imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
        spicyLevel: 0,
        isVegetarian: true,
      },
    ];

    for (const p of products) {
      await storage.createProduct(insertProductSchema.parse(p));
    }
  }

  const existingLocations = await storage.getLocations();
  if (existingLocations.length === 0) {
    const locations = [
      {
        name: "Heat Box F-7",
        address: "Shop 16, Block 12-B, F-7 Markaz, Islamabad",
        latitude: "33.7215",
        longitude: "73.0537",
        phone: "+92 300 1234567",
        hours: "Mon - Sun: 12:00 PM - 12:00 AM",
      },
      {
        name: "Heat Box DHA Phase 2",
        address: "Sector E, DHA Phase 2, Islamabad",
        latitude: "33.5686",
        longitude: "73.1664",
        phone: "+92 300 7654321",
        hours: "Mon - Sun: 12:00 PM - 02:00 AM",
      },
    ];

    for (const l of locations) {
      await storage.createLocation(insertLocationSchema.parse(l));
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // Products
  app.get(api.products.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    const spicyLevel = req.query.spicyLevel ? Number(req.query.spicyLevel) : undefined;
    const products = await storage.getProducts(category, spicyLevel);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  // Orders
  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      
      // Calculate total amount from current product prices
      let total = 0;
      const orderItemsData = [];

      for (const item of input.items) {
        const product = await storage.getProduct(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        const price = Number(product.price);
        total += price * item.quantity;
        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          priceAtTime: product.price,
        });
      }

      const orderData = {
        ...input.order,
        totalAmount: total.toFixed(2),
        status: "confirmed",
        userId: req.user ? (req.user as any).claims.sub : null,
      };

      const order = await storage.createOrder(orderData);

      for (const item of orderItemsData) {
        await storage.createOrderItem({
          orderId: order.id,
          ...item,
        });
      }

      res.status(201).json({
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(400).json({ message: (err as Error).message });
    }
  });

  app.get(api.orders.get.path, async (req, res) => {
    const order = await storage.getOrder(Number(req.params.id));
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const items = await storage.getOrderItems(order.id);
    res.json({ ...order, items });
  });

  // Reservations
  app.post(api.reservations.create.path, async (req, res) => {
    try {
      const input = api.reservations.create.input.parse(req.body);
      const reservation = await storage.createReservation({
        ...input,
        userId: req.user ? (req.user as any).claims.sub : null,
      });
      res.status(201).json(reservation);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Locations
  app.get(api.locations.list.path, async (req, res) => {
    const locations = await storage.getLocations();
    res.json(locations);
  });

  // Loyalty
  app.get(api.loyalty.get.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = (req.user as any).claims.sub;
    let account = await storage.getLoyaltyAccount(userId);
    
    if (!account) {
      account = await storage.createLoyaltyAccount({ userId });
    }
    
    res.json(account);
  });

  // Seed data
  seedDatabase().catch(console.error);

  return httpServer;
}
