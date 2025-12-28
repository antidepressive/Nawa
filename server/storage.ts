import { 
  users, 
  contactSubmissions, 
  newsletterSubscriptions,
  workshopRegistrations,
  leadershipWorkshopRegistrations,
  jobApplications,
  accounts,
  categories,
  transactions,
  budgets,
  userSettings,
  type User, 
  type InsertUser,
  type ContactSubmission,
  type InsertContactSubmission,
  type NewsletterSubscription,
  type InsertNewsletterSubscription,
  type WorkshopRegistration,
  type InsertWorkshopRegistration,
  type LeadershipWorkshopRegistration,
  type InsertLeadershipWorkshopRegistration,
  type JobApplication,
  type InsertJobApplication,
  type Account,
  type InsertAccount,
  type Category,
  type InsertCategory,
  type Transaction,
  type InsertTransaction,
  type Budget,
  type InsertBudget,
  type UserSettings,
  type InsertUserSettings,
  promoCodes,
  type PromoCode,
  type InsertPromoCode
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
  createLeadershipWorkshopRegistration(registration: InsertLeadershipWorkshopRegistration): Promise<LeadershipWorkshopRegistration>;
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  getNewsletterSubmissions(): Promise<NewsletterSubscription[]>;
  getWorkshopRegistrations(): Promise<WorkshopRegistration[]>;
  getLeadershipWorkshopRegistrations(): Promise<LeadershipWorkshopRegistration[]>;
  getJobApplications(): Promise<JobApplication[]>;
  // Delete methods
  deleteContactSubmission(id: number): Promise<boolean>;
  deleteNewsletterSubscription(id: number): Promise<boolean>;
  deleteWorkshopRegistration(id: number): Promise<boolean>;
  deleteLeadershipWorkshopRegistration(id: number): Promise<boolean>;
  deleteJobApplication(id: number): Promise<boolean>;
  // Bulk delete methods
  deleteContactSubmissions(ids: number[]): Promise<number>;
  deleteNewsletterSubscriptions(ids: number[]): Promise<number>;
  deleteWorkshopRegistrations(ids: number[]): Promise<number>;
  deleteLeadershipWorkshopRegistrations(ids: number[]): Promise<number>;
  deleteJobApplications(ids: number[]): Promise<number>;
  // Finance methods
  getAccounts(): Promise<Account[]>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccount(id: number, account: Partial<InsertAccount>): Promise<Account | undefined>;
  deleteAccount(id: number): Promise<boolean>;
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  getTransactions(): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;
  deleteTransactions(ids: number[]): Promise<number>;
  getBudgets(): Promise<Budget[]>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: number, budget: Partial<InsertBudget>): Promise<Budget | undefined>;
  deleteBudget(id: number): Promise<boolean>;
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined>;
  // Promo code methods
  createPromoCode(data: InsertPromoCode): Promise<PromoCode>;
  getPromoCode(code: string): Promise<PromoCode | undefined>;
  getPromoCodes(): Promise<PromoCode[]>;
  updatePromoCode(id: number, data: Partial<InsertPromoCode>): Promise<PromoCode | undefined>;
  deletePromoCode(id: number): Promise<boolean>;
  deletePromoCodes(ids: number[]): Promise<number>;
  incrementPromoCodeUsage(code: string): Promise<boolean>;
  validatePromoCode(code: string, originalPrice: number): Promise<{ valid: boolean; discountAmount: number; finalPrice: number; error?: string }>;
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

  async createLeadershipWorkshopRegistration(registration: InsertLeadershipWorkshopRegistration): Promise<LeadershipWorkshopRegistration> {
    const [leadershipWorkshopRegistration] = await db
      .insert(leadershipWorkshopRegistrations)
      .values(registration)
      .returning();
    return leadershipWorkshopRegistration;
  }

  async getLeadershipWorkshopRegistrations(): Promise<LeadershipWorkshopRegistration[]> {
    return await db.select().from(leadershipWorkshopRegistrations).orderBy(leadershipWorkshopRegistrations.createdAt);
  }

  async createJobApplication(application: InsertJobApplication): Promise<JobApplication> {
    const [jobApplication] = await db
      .insert(jobApplications)
      .values(application)
      .returning();
    return jobApplication;
  }

  async getJobApplications(): Promise<JobApplication[]> {
    return await db.select().from(jobApplications).orderBy(jobApplications.createdAt);
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

  async deleteLeadershipWorkshopRegistration(id: number): Promise<boolean> {
    const result = await db
      .delete(leadershipWorkshopRegistrations)
      .where(eq(leadershipWorkshopRegistrations.id, id));
    return result.rowCount > 0;
  }

  async deleteJobApplication(id: number): Promise<boolean> {
    const result = await db
      .delete(jobApplications)
      .where(eq(jobApplications.id, id));
    return result.rowCount > 0;
  }

  // Bulk delete methods
  async deleteContactSubmissions(ids: number[]): Promise<number> {
    if (ids.length === 0) return 0;
    const result = await db
      .delete(contactSubmissions)
      .where(sql`${contactSubmissions.id} = ANY(ARRAY[${sql.join(ids.map(id => sql`${id}::int`), sql`, `)}])`);
    return result.rowCount || 0;
  }

  async deleteNewsletterSubscriptions(ids: number[]): Promise<number> {
    if (ids.length === 0) return 0;
    const result = await db
      .delete(newsletterSubscriptions)
      .where(sql`${newsletterSubscriptions.id} = ANY(ARRAY[${sql.join(ids.map(id => sql`${id}::int`), sql`, `)}])`);
    return result.rowCount || 0;
  }

  async deleteWorkshopRegistrations(ids: number[]): Promise<number> {
    if (ids.length === 0) return 0;
    const result = await db
      .delete(workshopRegistrations)
      .where(sql`${workshopRegistrations.id} = ANY(ARRAY[${sql.join(ids.map(id => sql`${id}::int`), sql`, `)}])`);
    return result.rowCount || 0;
  }

  async deleteLeadershipWorkshopRegistrations(ids: number[]): Promise<number> {
    if (ids.length === 0) return 0;
    const result = await db
      .delete(leadershipWorkshopRegistrations)
      .where(sql`${leadershipWorkshopRegistrations.id} = ANY(ARRAY[${sql.join(ids.map(id => sql`${id}::int`), sql`, `)}])`);
    return result.rowCount || 0;
  }

  async deleteJobApplications(ids: number[]): Promise<number> {
    if (ids.length === 0) return 0;
    const result = await db
      .delete(jobApplications)
      .where(sql`${jobApplications.id} = ANY(ARRAY[${sql.join(ids.map(id => sql`${id}::int`), sql`, `)}])`);
    return result.rowCount || 0;
  }

  // Finance methods
  async getAccounts(): Promise<Account[]> {
    return await db.select().from(accounts).where(eq(accounts.isActive, true)).orderBy(accounts.name);
  }

  async createAccount(account: InsertAccount): Promise<Account> {
    const [newAccount] = await db
      .insert(accounts)
      .values(account)
      .returning();
    return newAccount;
  }

  async updateAccount(id: number, account: Partial<InsertAccount>): Promise<Account | undefined> {
    const [updatedAccount] = await db
      .update(accounts)
      .set({ ...account, updatedAt: new Date() })
      .where(eq(accounts.id, id))
      .returning();
    return updatedAccount || undefined;
  }

  async deleteAccount(id: number): Promise<boolean> {
    const result = await db
      .delete(accounts)
      .where(eq(accounts.id, id));
    return result.rowCount > 0;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id));
    return result.rowCount > 0;
  }

  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(transactions.date);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const [updatedTransaction] = await db
      .update(transactions)
      .set({ ...transaction, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();
    return updatedTransaction || undefined;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    const result = await db
      .delete(transactions)
      .where(eq(transactions.id, id));
    return result.rowCount > 0;
  }

  async deleteTransactions(ids: number[]): Promise<number> {
    if (ids.length === 0) return 0;
    const result = await db
      .delete(transactions)
      .where(sql`${transactions.id} = ANY(ARRAY[${sql.join(ids.map(id => sql`${id}::int`), sql`, `)}])`);
    return result.rowCount || 0;
  }

  async getBudgets(): Promise<Budget[]> {
    return await db.select().from(budgets).where(eq(budgets.isActive, true)).orderBy(budgets.startDate);
  }

  async createBudget(budget: InsertBudget): Promise<Budget> {
    const [newBudget] = await db
      .insert(budgets)
      .values(budget)
      .returning();
    return newBudget;
  }

  async updateBudget(id: number, budget: Partial<InsertBudget>): Promise<Budget | undefined> {
    const [updatedBudget] = await db
      .update(budgets)
      .set({ ...budget, updatedAt: new Date() })
      .where(eq(budgets.id, id))
      .returning();
    return updatedBudget || undefined;
  }

  async deleteBudget(id: number): Promise<boolean> {
    const result = await db
      .delete(budgets)
      .where(eq(budgets.id, id));
    return result.rowCount > 0;
  }

  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return settings || undefined;
  }

  async createUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const [newSettings] = await db
      .insert(userSettings)
      .values(settings)
      .returning();
    return newSettings;
  }

  async updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined> {
    const [updatedSettings] = await db
      .update(userSettings)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(userSettings.userId, userId))
      .returning();
    return updatedSettings || undefined;
  }

  // Promo code methods
  async createPromoCode(data: InsertPromoCode): Promise<PromoCode> {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b9183271-28f2-492d-be3d-6d4b5598cbd0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:401',message:'Storage: data received',data:{expiresAt:data.expiresAt,expiresAtType:typeof data.expiresAt,isString:typeof data.expiresAt==='string',isNull:data.expiresAt===null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    // Normalize code to uppercase and convert expiresAt string to Date object
    const normalizedData = {
      ...data,
      code: data.code.toUpperCase().trim(),
      discountValue: typeof data.discountValue === 'number' ? data.discountValue.toString() : data.discountValue,
      expiresAt: data.expiresAt ? (typeof data.expiresAt === 'string' ? new Date(data.expiresAt) : data.expiresAt) : null,
      updatedAt: new Date(),
    };
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b9183271-28f2-492d-be3d-6d4b5598cbd0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'storage.ts:408',message:'Storage: normalizedData before insert',data:{expiresAt:normalizedData.expiresAt,expiresAtType:typeof normalizedData.expiresAt,isString:typeof normalizedData.expiresAt==='string'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    const [promoCode] = await db
      .insert(promoCodes)
      .values(normalizedData as any)
      .returning();
    return promoCode;
  }

  async getPromoCode(code: string): Promise<PromoCode | undefined> {
    const normalizedCode = code.toUpperCase().trim();
    const [promoCode] = await db
      .select()
      .from(promoCodes)
      .where(eq(promoCodes.code, normalizedCode));
    return promoCode || undefined;
  }

  async getPromoCodes(): Promise<PromoCode[]> {
    return await db.select().from(promoCodes).orderBy(promoCodes.createdAt);
  }

  async updatePromoCode(id: number, data: Partial<InsertPromoCode>): Promise<PromoCode | undefined> {
    const updateData: any = { ...data, updatedAt: new Date() };
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase().trim();
    }
    if (updateData.discountValue !== undefined && typeof updateData.discountValue === 'number') {
      updateData.discountValue = updateData.discountValue.toString();
    }
    // Convert expiresAt string to Date object if provided
    if (updateData.expiresAt !== undefined) {
      updateData.expiresAt = updateData.expiresAt ? (typeof updateData.expiresAt === 'string' ? new Date(updateData.expiresAt) : updateData.expiresAt) : null;
    }
    const [updatedPromoCode] = await db
      .update(promoCodes)
      .set(updateData)
      .where(eq(promoCodes.id, id))
      .returning();
    return updatedPromoCode || undefined;
  }

  async deletePromoCode(id: number): Promise<boolean> {
    const result = await db
      .delete(promoCodes)
      .where(eq(promoCodes.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async deletePromoCodes(ids: number[]): Promise<number> {
    if (ids.length === 0) return 0;
    const result = await db
      .delete(promoCodes)
      .where(sql`${promoCodes.id} = ANY(ARRAY[${sql.join(ids.map(id => sql`${id}::int`), sql`, `)}])`);
    return result.rowCount || 0;
  }

  async incrementPromoCodeUsage(code: string): Promise<boolean> {
    const normalizedCode = code.toUpperCase().trim();
    const result = await db
      .update(promoCodes)
      .set({ 
        usedCount: sql`${promoCodes.usedCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(promoCodes.code, normalizedCode));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async validatePromoCode(code: string, originalPrice: number): Promise<{ valid: boolean; discountAmount: number; finalPrice: number; error?: string }> {
    const promoCode = await this.getPromoCode(code);
    
    if (!promoCode) {
      return {
        valid: false,
        discountAmount: 0,
        finalPrice: originalPrice,
        error: 'Invalid promo code'
      };
    }

    if (!promoCode.isActive) {
      return {
        valid: false,
        discountAmount: 0,
        finalPrice: originalPrice,
        error: 'This promo code is not active'
      };
    }

    if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
      return {
        valid: false,
        discountAmount: 0,
        finalPrice: originalPrice,
        error: 'This promo code has expired'
      };
    }

    if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
      return {
        valid: false,
        discountAmount: 0,
        finalPrice: originalPrice,
        error: 'This promo code has reached its usage limit'
      };
    }

    // Calculate discount
    const discountValue = parseFloat(promoCode.discountValue.toString());
    let discountAmount = 0;
    
    if (promoCode.discountType === 'percentage') {
      if (discountValue < 0 || discountValue > 100) {
        return {
          valid: false,
          discountAmount: 0,
          finalPrice: originalPrice,
          error: 'Invalid discount percentage'
        };
      }
      discountAmount = (originalPrice * discountValue) / 100;
    } else if (promoCode.discountType === 'fixed') {
      discountAmount = discountValue;
      if (discountAmount > originalPrice) {
        discountAmount = originalPrice; // Don't allow negative prices
      }
    }

    const finalPrice = Math.max(0, originalPrice - discountAmount);

    return {
      valid: true,
      discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimal places
      finalPrice: Math.round(finalPrice * 100) / 100
    };
  }
}

export const storage = new DatabaseStorage();
