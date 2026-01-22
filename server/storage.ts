import { 
  products, orders, orderItems, reservations, locations, loyaltyAccounts,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type Reservation, type InsertReservation,
  type Location, type InsertLocation,
  type LoyaltyAccount, type InsertLoyaltyAccount
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(category?: string, spicyLevel?: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<(OrderItem & { product: Product })[]>;
  
  // Reservations
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  
  // Locations
  getLocations(): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;

  // Loyalty
  getLoyaltyAccount(userId: string): Promise<LoyaltyAccount | undefined>;
  createLoyaltyAccount(account: InsertLoyaltyAccount): Promise<LoyaltyAccount>;
  updateLoyaltyPoints(userId: string, points: number): Promise<LoyaltyAccount>;
}

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(category?: string, spicyLevel?: number): Promise<Product[]> {
    let query = db.select().from(products);
    const filters = [];
    
    if (category) filters.push(eq(products.category, category));
    if (spicyLevel !== undefined) filters.push(eq(products.spicyLevel, spicyLevel));
    
    if (filters.length > 0) {
      // @ts-ignore - complex query building
      return await query.where(...filters);
    }
    
    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async createOrderItem(insertItem: InsertOrderItem): Promise<OrderItem> {
    const [item] = await db.insert(orderItems).values(insertItem).returning();
    return item;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderItems(orderId: number): Promise<(OrderItem & { product: Product })[]> {
    const items = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        priceAtTime: orderItems.priceAtTime,
        product: products,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, orderId));
    
    return items;
  }

  // Reservations
  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const [reservation] = await db.insert(reservations).values(insertReservation).returning();
    return reservation;
  }

  // Locations
  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations);
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const [location] = await db.insert(locations).values(insertLocation).returning();
    return location;
  }

  // Loyalty
  async getLoyaltyAccount(userId: string): Promise<LoyaltyAccount | undefined> {
    const [account] = await db.select().from(loyaltyAccounts).where(eq(loyaltyAccounts.userId, userId));
    return account;
  }

  async createLoyaltyAccount(insertAccount: InsertLoyaltyAccount): Promise<LoyaltyAccount> {
    const [account] = await db.insert(loyaltyAccounts).values(insertAccount).returning();
    return account;
  }

  async updateLoyaltyPoints(userId: string, pointsToAdd: number): Promise<LoyaltyAccount> {
    // This is a simple implementation. In a real app, you'd calculate tiers based on total points.
    const [account] = await db
      .update(loyaltyAccounts)
      .set({ 
        points: sql`${loyaltyAccounts.points} + ${pointsToAdd}` 
      })
      .where(eq(loyaltyAccounts.userId, userId))
      .returning();
    return account;
  }
}

export const storage = new DatabaseStorage();
