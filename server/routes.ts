import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { insertProductSchema, insertLocationSchema, insertBlogPostSchema, insertFestiveDealSchema } from "@shared/schema";

async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    // ... existing products code ...
  }

  const existingLocations = await storage.getLocations();
  if (existingLocations.length === 0) {
    // ... existing locations code ...
  }

  const existingBlog = await storage.getBlogPosts();
  if (existingBlog.length === 0) {
    const posts = [
      {
        slug: "secret-behind-peri-peri",
        title: "The Secret Behind Our Peri Peri: A Journey of Flavor",
        excerpt: "Peri Peri isn't just a sauce; it's a centuries-old heritage bottled with passion. Discover how we source our bird's eye chilies.",
        content: "Full story of our Peri Peri sauce journey from African bird's eye chilies to our soulful blend in Islamabad.",
        author: "Chef at Heat Box",
        readTime: "5 min read",
        imageUrl: "https://images.unsplash.com/photo-1599307737119-21d3f980757d",
      }
    ];
    for (const post of posts) {
      await storage.createBlogPost(insertBlogPostSchema.parse(post));
    }
  }

  const existingFestive = await storage.getFestiveDeals();
  if (existingFestive.length === 0) {
    const deals = [
      {
        title: "The Festive Feast",
        description: "2 Large Specialty Pizzas, 10 Signature Peri Wings, 4 Peri Sliders, 1 Giant Holiday Brownie.",
        price: "4850.00",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
        tag: "MOST POPULAR",
      },
      {
        title: "Winter Warmer Combo",
        description: "Peri Peri Spicy Soup, Signature Spiced Burger, Hot Artisan Beverage, Seasoned Fries.",
        price: "1250.00",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        tag: "BEST FOR 1",
      }
    ];
    for (const deal of deals) {
      await storage.createFestiveDeal(insertFestiveDealSchema.parse(deal));
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

  // Blog
  app.get(api.blog.list.path, async (req, res) => {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  });

  app.get(api.blog.get.path, async (req, res) => {
    const post = await storage.getBlogPost(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  // Festive Deals
  app.get(api.festive.list.path, async (req, res) => {
    const deals = await storage.getFestiveDeals();
    res.json(deals);
  });

  // Seed data
  seedDatabase().catch(console.error);

  return httpServer;
}
