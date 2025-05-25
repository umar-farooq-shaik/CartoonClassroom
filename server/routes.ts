import { Express, Request, Response, NextFunction } from "express";
import { Server } from "http";
import { z } from "zod";
import { storage, IStorage } from "./storage.js";
import { insertUserSchema, insertStorySchema, insertTextbookSchema, insertAchievementSchema, insertUserProgressSchema } from "../shared/schema.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration endpoint
  app.post("/api/users", async (req, res) => {
    try {
      console.log('Received user data:', req.body);
      
      // Check if user already exists first
      const existingUser = await storage.getUserByExternalId(req.body.externalId);
      if (existingUser) {
        console.log('User already exists, returning existing user');
        return res.json(existingUser);
      }
      
      // Parse and validate the data
      const userData = insertUserSchema.parse(req.body);
      console.log('Parsed user data:', userData);
      
      const user = await storage.createUser(userData);
      console.log('Created user successfully:', user);
      res.json(user);
    } catch (error) {
      console.error('User creation error details:', error);
      if (error instanceof z.ZodError) {
        console.error('Validation errors:', error.errors);
        return res.status(400).json({ error: "Invalid user data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create user", details: error.message });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid user data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Get user by external ID
  app.get("/api/users/external/:externalId", async (req, res) => {
    try {
      const { externalId } = req.params;
      const user = await storage.getUserByExternalId(externalId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.get("/api/auth/user/:externalId", async (req, res) => {
    try {
      const { externalId } = req.params;
      const user = await storage.getUserByExternalId(externalId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Get current user's stories
  app.get("/api/stories/user", async (req, res) => {
    try {
      // For demo purposes, return empty array until user creates stories
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to get stories" });
    }
  });

  // Get stories by subject
  app.get("/api/stories/subject/:subject", async (req, res) => {
    try {
      const { subject } = req.params;
      const userId = 1; // Demo user ID
      const stories = await storage.getStoriesBySubject(userId, subject);
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: "Failed to get stories by subject" });
    }
  });

  // Get single story
  app.get("/api/stories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const story = await storage.getStory(parseInt(id));
      
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
      
      res.json(story);
    } catch (error) {
      res.status(500).json({ error: "Failed to get story" });
    }
  });

  // Story generation endpoint
  app.post("/api/stories/generate", async (req, res) => {
    try {
      const { topic, subject, userId, userPreferences } = req.body;
      
      if (!topic || !subject || !userId) {
        return res.status(400).json({ error: "Topic, subject, and userId are required" });
      }

      // Get user preferences for personalization
      const user = await storage.getUser(userId);
      const favoriteCartoons = user?.favoriteCartoons || userPreferences?.favoriteCartoons || ['SpongeBob'];
      const mainCharacter = favoriteCartoons[0] || 'SpongeBob';

      // Use Gemini AI to generate educational story
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Create an educational comic story for children about "${topic}" in the subject of ${subject}. 
      The main character should be ${mainCharacter}. 
      
      Format the response as a JSON object with this structure:
      {
        "title": "Story title",
        "panels": [
          {
            "character": "character_name",
            "characterName": "Character Display Name",
            "text": "Dialogue and educational content",
            "background": "Scene description"
          }
        ]
      }
      
      Requirements:
      - Make it fun and educational for kids aged 5-12
      - Include 4-6 panels
      - Explain the topic clearly with examples
      - Use simple language
      - Make it engaging with the cartoon character
      - Include interactive elements when possible
      
      Topic: ${topic}
      Subject: ${subject}
      Character: ${mainCharacter}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the AI response
      let storyData;
      try {
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          storyData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.log('AI parsing failed, using template story');
        // Fallback to template stories if AI parsing fails
        const templateStories = {
        Math: {
          Addition: {
            title: "SpongeBob's Krabby Patty Math Adventure",
            panels: [
              {
                character: "spongebob",
                characterName: "SpongeBob SquarePants",
                text: "Hi there! I'm SpongeBob and I love making Krabby Patties! Today I need to learn about addition to make the perfect number of patties!",
                background: "The Krusty Krab kitchen with cooking equipment"
              },
              {
                character: "spongebob",
                characterName: "SpongeBob SquarePants", 
                text: "Mr. Krabs asked me to make patties for today! I have 2 patties ready, and I need to make 3 more. Let me count: 2 + 3 = ?",
                background: "SpongeBob counting patties on the grill"
              },
              {
                character: "spongebob",
                characterName: "SpongeBob SquarePants",
                text: "Let me use my fingers to help! 2 patties plus 3 more patties... that's 5 patties total! 2 + 3 = 5!",
                background: "SpongeBob showing fingers while counting"
              },
              {
                character: "spongebob",
                characterName: "SpongeBob SquarePants",
                text: "Fantastic! Now I know that when we ADD numbers together, we get a bigger number! Addition helps me make the right amount of Krabby Patties!",
                background: "SpongeBob proudly showing 5 perfectly cooked Krabby Patties"
              }
            ]
          },
          Multiplication: {
            title: "Pokemon Math Training with Pikachu",
            panels: [
              {
                character: "pikachu",
                characterName: "Pikachu",
                text: "Pika pika! I'm Pikachu and I love training! But today I need to learn multiplication to become stronger!",
                background: "Pokemon training ground with Pokeballs"
              },
              {
                character: "pikachu", 
                characterName: "Pikachu",
                text: "I have 3 groups of Pokeballs, and each group has 4 Pokeballs. How many Pokeballs do I have in total?",
                background: "3 groups of 4 Pokeballs each, clearly separated"
              },
              {
                character: "pikachu",
                characterName: "Pikachu", 
                text: "Let me count them all! Group 1: 4 balls, Group 2: 4 balls, Group 3: 4 balls. That's 4 + 4 + 4 = 12!",
                background: "Pikachu pointing at each group while counting"
              },
              {
                character: "pikachu",
                characterName: "Pikachu",
                text: "But there's a faster way! 3 groups × 4 balls = 12 balls total! Multiplication is like repeated addition! Pika pika!",
                background: "Pikachu celebrating with electric sparks and all 12 Pokeballs"
              }
            ]
          }
        },
        Science: {
          Plants: {
            title: "Dora's Plant Adventure",
            panels: [
              {
                character: "dora",
                characterName: "Dora the Explorer",
                text: "¡Hola! I'm Dora! Today we're going on an adventure to learn about plants! Plants are living things that grow everywhere!",
                background: "Dora in a beautiful garden with various plants"
              },
              {
                character: "dora",
                characterName: "Dora the Explorer",
                text: "Look at this plant! It has roots that drink water from the soil, a stem that stands tall, and leaves that make food from sunlight!",
                background: "Close-up of a plant showing roots, stem, and leaves"
              },
              {
                character: "dora",
                characterName: "Dora the Explorer", 
                text: "Plants need four things to grow: water, sunlight, air, and soil. Just like we need food and water, plants need these to be healthy!",
                background: "Dora pointing to the sun, watering a plant, showing soil and air"
              },
              {
                character: "dora",
                characterName: "Dora the Explorer",
                text: "¡Excelente! Plants are amazing! They give us oxygen to breathe and food to eat. Let's take care of plants everywhere we go!",
                background: "Dora surrounded by healthy, happy plants and flowers"
              }
            ]
          }
        },
        English: {
          Reading: {
            title: "Pokemon Reading Adventure",
            panels: [
              {
                character: "pikachu",
                characterName: "Pikachu",
                text: "Pika pika! Reading is one of my favorite activities! Books take me on amazing adventures without leaving home!",
                background: "Pikachu sitting with a pile of colorful books"
              },
              {
                character: "pikachu",
                characterName: "Pikachu",
                text: "When I read, I look at each word carefully. I sound out letters: C-A-T makes 'cat'! Reading gets easier with practice!",
                background: "Pikachu pointing at words in an open book"
              },
              {
                character: "pikachu",
                characterName: "Pikachu",
                text: "Books have stories about brave Pokemon, exciting battles, and faraway places! Every book teaches me something new!",
                background: "Pikachu imagining scenes from adventure books floating around"
              },
              {
                character: "pikachu",
                characterName: "Pikachu",
                text: "The more I read, the smarter I become! Reading helps me learn new words and understand the world better! Pika pika!",
                background: "Pikachu happily surrounded by books and floating words"
              }
            ]
          }
        },
        Social: {
          Friendship: {
            title: "SpongeBob's Friendship Lesson",
            panels: [
              {
                character: "spongebob",
                characterName: "SpongeBob SquarePants",
                text: "Hi friends! I'm SpongeBob and I love making friends! Good friends make life so much more fun and happy!",
                background: "SpongeBob with Patrick, Sandy, and Squidward in Bikini Bottom"
              },
              {
                character: "spongebob", 
                characterName: "SpongeBob SquarePants",
                text: "Being a good friend means being kind, sharing, and helping others when they need it. I always try to help my friends!",
                background: "SpongeBob helping Patrick with a problem"
              },
              {
                character: "spongebob",
                characterName: "SpongeBob SquarePants",
                text: "Sometimes friends disagree, and that's okay! The important thing is to talk about it and say sorry when we make mistakes.",
                background: "SpongeBob and Patrick talking things out after a disagreement"
              },
              {
                character: "spongebob",
                characterName: "SpongeBob SquarePants",
                text: "Friends care about each other and have fun together! Being a good friend makes you feel happy inside! I'm ready to be your friend!",
                background: "SpongeBob playing happily with all his friends"
              }
            ]
          }
        }
      };

        // Get story from templates or create a default one
        storyData = (templateStories as any)[subject]?.[topic] || {
          title: `Learning About ${topic}`,
          panels: [
            {
              character: mainCharacter.toLowerCase(),
              characterName: mainCharacter,
              text: `Hi there! Today we're going to learn about ${topic} in ${subject}. This is going to be so much fun!`,
              background: "A colorful classroom setting"
            },
            {
              character: mainCharacter.toLowerCase(), 
              characterName: mainCharacter,
              text: `${topic} is really interesting! Let me explain what makes it special and why it's important to learn about.`,
              background: "Educational setting with books and learning materials"
            },
            {
              character: mainCharacter.toLowerCase(),
              characterName: mainCharacter, 
              text: `Here's a fun way to remember ${topic}: think of it like a game where you get to explore and discover new things!`,
              background: "Fun activity scene with colorful elements"
            },
            {
              character: mainCharacter.toLowerCase(),
              characterName: mainCharacter, 
              text: `Great job learning about ${topic}! You're doing amazing and I'm so proud of you!`,
              background: "Celebration scene with confetti and cheers"
            }
          ]
        };
      }

      // Save the generated story to database
      const storyToSave = {
        userId,
        subject,
        topic,
        title: storyData.title,
        content: JSON.stringify(storyData),
        panels: storyData.panels,
        isLearned: false
      };

      const savedStory = await storage.createStory(storyToSave);
      
      // Return the saved story with panels for display
      const storyResponse = {
        ...savedStory
      };

      res.json(storyResponse);
    } catch (error) {
      console.error('Story generation error:', error);
      res.status(500).json({ error: "Failed to generate story" });
    }
  });

  // Save story progress
  app.post("/api/stories/save", async (req, res) => {
    try {
      const { storyId, isLearned } = req.body;
      
      // For demo mode, just return success
      res.json({ success: true, storyId, isLearned });
    } catch (error) {
      res.status(500).json({ error: "Failed to save story progress" });
    }
  });

  // Get current user's textbooks
  app.get("/api/textbooks/user", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      const textbooks = await storage.getTextbooksByUser(userId);
      res.json(textbooks);
    } catch (error) {
      res.status(500).json({ error: "Failed to get textbooks" });
    }
  });

  // Create new textbook
  app.post("/api/textbooks", async (req, res) => {
    try {
      const textbookData = insertTextbookSchema.parse(req.body);
      const textbook = await storage.createTextbook(textbookData);
      res.json(textbook);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid textbook data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create textbook" });
    }
  });

  // Get current user's achievements
  app.get("/api/achievements/user", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      const achievements = await storage.getAchievementsByUser(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Failed to get achievements" });
    }
  });

  // Create new achievement
  app.post("/api/achievements", async (req, res) => {
    try {
      const achievementData = insertAchievementSchema.parse(req.body);
      const achievement = await storage.createAchievement(achievementData);
      res.json(achievement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid achievement data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create achievement" });
    }
  });

  // Get current user's progress
  app.get("/api/progress/user", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to get progress" });
    }
  });

  // Update user progress
  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createUserProgress(progressData);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid progress data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  return app as any;
}