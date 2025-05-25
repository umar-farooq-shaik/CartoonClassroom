import { users, stories, textbooks, achievements, userProgress, type User, type InsertUser, type Story, type InsertStory, type Textbook, type InsertTextbook, type Achievement, type InsertAchievement, type UserProgress, type InsertUserProgress } from "@shared/schema";
import { db } from './db';
import { eq, and } from 'drizzle-orm';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByExternalId(externalId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;

  // Story operations
  getStory(id: number): Promise<Story | undefined>;
  getStoriesByUser(userId: number): Promise<Story[]>;
  getStoriesBySubject(userId: number, subject: string): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  updateStory(id: number, updates: Partial<InsertStory>): Promise<Story>;

  // Textbook operations
  getTextbook(id: number): Promise<Textbook | undefined>;
  getTextbooksByUser(userId: number): Promise<Textbook[]>;
  createTextbook(textbook: InsertTextbook): Promise<Textbook>;
  updateTextbook(id: number, updates: Partial<InsertTextbook>): Promise<Textbook>;
  addStoryToTextbook(textbookId: number, storyId: number): Promise<Textbook>;

  // Achievement operations
  getAchievementsByUser(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // Progress operations
  getUserProgress(userId: number): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(userId: number, updates: Partial<InsertUserProgress>): Promise<UserProgress>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByExternalId(externalId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.externalId, externalId)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    if (!result[0]) {
      throw new Error('User not found');
    }
    return result[0];
  }

  async getStory(id: number): Promise<Story | undefined> {
    const result = await db.select().from(stories).where(eq(stories.id, id)).limit(1);
    return result[0];
  }

  async getStoriesByUser(userId: number): Promise<Story[]> {
    return await db.select().from(stories).where(eq(stories.userId, userId));
  }

  async getStoriesBySubject(userId: number, subject: string): Promise<Story[]> {
    return await db.select().from(stories)
      .where(and(eq(stories.userId, userId), eq(stories.subject, subject)));
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const result = await db.insert(stories).values(insertStory).returning();
    return result[0];
  }

  async updateStory(id: number, updates: Partial<InsertStory>): Promise<Story> {
    const result = await db.update(stories).set(updates).where(eq(stories.id, id)).returning();
    if (!result[0]) {
      throw new Error('Story not found');
    }
    return result[0];
  }

  async getTextbook(id: number): Promise<Textbook | undefined> {
    const result = await db.select().from(textbooks).where(eq(textbooks.id, id)).limit(1);
    return result[0];
  }

  async getTextbooksByUser(userId: number): Promise<Textbook[]> {
    return await db.select().from(textbooks).where(eq(textbooks.userId, userId));
  }

  async createTextbook(insertTextbook: InsertTextbook): Promise<Textbook> {
    const result = await db.insert(textbooks).values(insertTextbook).returning();
    return result[0];
  }

  async updateTextbook(id: number, updates: Partial<InsertTextbook>): Promise<Textbook> {
    const result = await db.update(textbooks).set(updates).where(eq(textbooks.id, id)).returning();
    if (!result[0]) {
      throw new Error('Textbook not found');
    }
    return result[0];
  }

  async addStoryToTextbook(textbookId: number, storyId: number): Promise<Textbook> {
    const textbook = await this.getTextbook(textbookId);
    if (!textbook) {
      throw new Error('Textbook not found');
    }
    
    const updatedStoryIds = [...textbook.storyIds, storyId];
    return await this.updateTextbook(textbookId, { storyIds: updatedStoryIds });
  }

  async getAchievementsByUser(userId: number): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.userId, userId));
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const result = await db.insert(achievements).values(insertAchievement).returning();
    return result[0];
  }

  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    const result = await db.select().from(userProgress).where(eq(userProgress.userId, userId)).limit(1);
    return result[0];
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const result = await db.insert(userProgress).values(insertProgress).returning();
    return result[0];
  }

  async updateUserProgress(userId: number, updates: Partial<InsertUserProgress>): Promise<UserProgress> {
    let existingProgress = await this.getUserProgress(userId);
    if (!existingProgress) {
      // Create new progress if it doesn't exist
      existingProgress = await this.createUserProgress({ userId, ...updates });
    } else {
      const result = await db.update(userProgress).set(updates).where(eq(userProgress.userId, userId)).returning();
      existingProgress = result[0];
    }
    return existingProgress;
  }
}

// Temporarily use memory storage until database is fully configured
class SimpleMemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private userIdCounter = 1;

  async getUser(id: number): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return undefined;
  }

  async getUserByExternalId(externalId: string): Promise<User | undefined> {
    return this.users.get(externalId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.userIdCounter++,
      createdAt: new Date(),
      ...insertUser,
      favoriteCartoons: insertUser.favoriteCartoons || []
    };
    this.users.set(insertUser.externalId, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error('User not found');
    const updated = { ...user, ...updates };
    this.users.set(user.externalId, updated);
    return updated;
  }

  // Minimal implementations for other methods
  async getStory(id: number): Promise<Story | undefined> { return undefined; }
  async getStoriesByUser(userId: number): Promise<Story[]> { return []; }
  async getStoriesBySubject(userId: number, subject: string): Promise<Story[]> { return []; }
  async createStory(story: InsertStory): Promise<Story> { 
    return { id: 1, createdAt: new Date(), ...story, isLearned: false };
  }
  async updateStory(id: number, updates: Partial<InsertStory>): Promise<Story> { 
    throw new Error('Not implemented');
  }
  async getTextbook(id: number): Promise<Textbook | undefined> { return undefined; }
  async getTextbooksByUser(userId: number): Promise<Textbook[]> { return []; }
  async createTextbook(textbook: InsertTextbook): Promise<Textbook> { 
    return { id: 1, createdAt: new Date(), ...textbook, storyIds: [], description: null };
  }
  async updateTextbook(id: number, updates: Partial<InsertTextbook>): Promise<Textbook> { 
    throw new Error('Not implemented');
  }
  async addStoryToTextbook(textbookId: number, storyId: number): Promise<Textbook> { 
    throw new Error('Not implemented');
  }
  async getAchievementsByUser(userId: number): Promise<Achievement[]> { return []; }
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> { 
    return { id: 1, unlockedAt: new Date(), ...achievement };
  }
  async getUserProgress(userId: number): Promise<UserProgress | undefined> { return undefined; }
  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> { 
    return { 
      id: 1, 
      ...progress, 
      totalStoriesRead: 0, 
      totalTimeSpent: 0, 
      currentStreak: 0, 
      lastActiveDate: null, 
      subjectProgress: {} 
    };
  }
  async updateUserProgress(userId: number, updates: Partial<InsertUserProgress>): Promise<UserProgress> { 
    return this.createUserProgress({ userId, ...updates });
  }
}

export const storage = new SimpleMemStorage();

class MemStorage implements IStorage {
  private users: Map<number, User>;
  private stories: Map<number, Story>;
  private textbooks: Map<number, Textbook>;
  private achievements: Map<number, Achievement>;
  private userProgress: Map<number, UserProgress>;
  private currentUserId: number;
  private currentStoryId: number;
  private currentTextbookId: number;
  private currentAchievementId: number;
  private currentProgressId: number;

  constructor() {
    this.users = new Map();
    this.stories = new Map();
    this.textbooks = new Map();
    this.achievements = new Map();
    this.userProgress = new Map();
    this.currentUserId = 1;
    this.currentStoryId = 1;
    this.currentTextbookId = 1;
    this.currentAchievementId = 1;
    this.currentProgressId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.firebaseUid === firebaseUid);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date()
    };
    this.users.set(id, user);

    // Create initial user progress
    await this.createUserProgress({
      userId: id,
      totalStoriesRead: 0,
      totalTimeSpent: 0,
      currentStreak: 0,
      lastActiveDate: new Date(),
      subjectProgress: {}
    });

    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async getStoriesByUser(userId: number): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(story => story.userId === userId);
  }

  async getStoriesBySubject(userId: number, subject: string): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(story => 
      story.userId === userId && story.subject === subject
    );
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = this.currentStoryId++;
    const story: Story = { 
      ...insertStory, 
      id, 
      createdAt: new Date()
    };
    this.stories.set(id, story);
    return story;
  }

  async updateStory(id: number, updates: Partial<InsertStory>): Promise<Story> {
    const story = this.stories.get(id);
    if (!story) throw new Error('Story not found');
    
    const updatedStory = { ...story, ...updates };
    this.stories.set(id, updatedStory);
    return updatedStory;
  }

  async getTextbook(id: number): Promise<Textbook | undefined> {
    return this.textbooks.get(id);
  }

  async getTextbooksByUser(userId: number): Promise<Textbook[]> {
    return Array.from(this.textbooks.values()).filter(textbook => textbook.userId === userId);
  }

  async createTextbook(insertTextbook: InsertTextbook): Promise<Textbook> {
    const id = this.currentTextbookId++;
    const textbook: Textbook = { 
      ...insertTextbook, 
      id, 
      createdAt: new Date()
    };
    this.textbooks.set(id, textbook);
    return textbook;
  }

  async updateTextbook(id: number, updates: Partial<InsertTextbook>): Promise<Textbook> {
    const textbook = this.textbooks.get(id);
    if (!textbook) throw new Error('Textbook not found');
    
    const updatedTextbook = { ...textbook, ...updates };
    this.textbooks.set(id, updatedTextbook);
    return updatedTextbook;
  }

  async addStoryToTextbook(textbookId: number, storyId: number): Promise<Textbook> {
    const textbook = this.textbooks.get(textbookId);
    if (!textbook) throw new Error('Textbook not found');
    
    const updatedStoryIds = [...textbook.storyIds, storyId];
    const updatedTextbook = { ...textbook, storyIds: updatedStoryIds };
    this.textbooks.set(textbookId, updatedTextbook);
    return updatedTextbook;
  }

  async getAchievementsByUser(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(achievement => achievement.userId === userId);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const achievement: Achievement = { 
      ...insertAchievement, 
      id, 
      unlockedAt: new Date()
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(progress => progress.userId === userId);
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = this.currentProgressId++;
    const progress: UserProgress = { 
      ...insertProgress, 
      id
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  async updateUserProgress(userId: number, updates: Partial<InsertUserProgress>): Promise<UserProgress> {
    const progress = Array.from(this.userProgress.values()).find(p => p.userId === userId);
    if (!progress) throw new Error('User progress not found');
    
    const updatedProgress = { ...progress, ...updates };
    this.userProgress.set(progress.id, updatedProgress);
    return updatedProgress;
  }
}

// Using the SimpleMemStorage for demo mode
// export const storage = new MemStorage();
