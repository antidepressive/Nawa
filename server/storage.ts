import { 
  users, 
  contactSubmissions, 
  newsletterSubscriptions,
  workshopRegistrations,
  type User, 
  type InsertUser,
  type ContactSubmission,
  type InsertContactSubmission,
  type NewsletterSubscription,
  type InsertNewsletterSubscription,
  type WorkshopRegistration,
  type InsertWorkshopRegistration
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  createWorkshopRegistration(registration: InsertWorkshopRegistration): Promise<WorkshopRegistration>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  getNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
  getWorkshopRegistrations(): Promise<WorkshopRegistration[]>;
  // Delete methods
  deleteContactSubmission(id: number): Promise<boolean>;
  deleteNewsletterSubscription(id: number): Promise<boolean>;
  deleteWorkshopRegistration(id: number): Promise<boolean>;
  // Bulk delete methods
  deleteContactSubmissions(ids: number[]): Promise<number>;
  deleteNewsletterSubscriptions(ids: number[]): Promise<number>;
  deleteWorkshopRegistrations(ids: number[]): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [contactSubmission] = await db
      .insert(contactSubmissions)
      .values(submission)
      .returning();
    return contactSubmission;
  }

  async createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const [newsletterSubscription] = await db
      .insert(newsletterSubscriptions)
      .values(subscription)
      .returning();
    return newsletterSubscription;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(contactSubmissions.createdAt);
  }

  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return await db.select().from(newsletterSubscriptions).orderBy(newsletterSubscriptions.createdAt);
  }

  async createWorkshopRegistration(registration: InsertWorkshopRegistration): Promise<WorkshopRegistration> {
    const [workshopRegistration] = await db
      .insert(workshopRegistrations)
      .values(registration)
      .returning();
    return workshopRegistration;
  }

  async getWorkshopRegistrations(): Promise<WorkshopRegistration[]> {
    return await db.select().from(workshopRegistrations).orderBy(workshopRegistrations.createdAt);
  }

  // Delete methods
  async deleteContactSubmission(id: number): Promise<boolean> {
    const result = await db
      .delete(contactSubmissions)
      .where(eq(contactSubmissions.id, id));
    return result.rowCount > 0;
  }

  async deleteNewsletterSubscription(id: number): Promise<boolean> {
    const result = await db
      .delete(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.id, id));
    return result.rowCount > 0;
  }

  async deleteWorkshopRegistration(id: number): Promise<boolean> {
    const result = await db
      .delete(workshopRegistrations)
      .where(eq(workshopRegistrations.id, id));
    return result.rowCount > 0;
  }

  // Bulk delete methods
  async deleteContactSubmissions(ids: number[]): Promise<number> {
    if (ids.length === 0) return 0;
    const result = await db
      .delete(contactSubmissions)
      .where(sql`${contactSubmissions.id} = ANY(${ids})`);
    return result.rowCount || 0;
  }

  async deleteNewsletterSubscriptions(ids: number[]): Promise<number> {
    if (ids.length === 0) return 0;
    const result = await db
      .delete(newsletterSubscriptions)
      .where(sql`${newsletterSubscriptions.id} = ANY(${ids})`);
    return result.rowCount || 0;
  }

  async deleteWorkshopRegistrations(ids: number[]): Promise<number> {
    if (ids.length === 0) return 0;
    const result = await db
      .delete(workshopRegistrations)
      .where(sql`${workshopRegistrations.id} = ANY(${ids})`);
    return result.rowCount || 0;
  }
}

export const storage = new DatabaseStorage();
