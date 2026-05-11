import { pgEnum, text, uuid, integer, timestamp, pgTable } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// 1. Define Enums
export const PresentationStatus = pgEnum("presentation_status", [
  "DRAFT",
  "GENERATING",
  "COMPLETED",
  "FAILED"
]);

// 2. Presentation Table
export const Presentation = pgTable("presentation", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  style: text("style").notNull(),
  tone: text("tone").notNull(),
  layout: text("layout").notNull(),
  slideCount: integer("slide_count").notNull(), // Changed to integer
  status: PresentationStatus("status").default("DRAFT").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Slide Table
export const Slide = pgTable("slide", {
  id: uuid("id").primaryKey().defaultRandom(),
  presentationId: uuid("presentation_id")
    .notNull()
    .references(() => Presentation.id, { onDelete: "cascade" }), // Added cascade for cleanup
  order: integer("order").notNull(), // Changed to integer
  title: text("title").notNull(),
  content: text("content").notNull(),
  notes: text("notes"),
  imageURL: text("image_url"),
  imagePrompt: text("image_prompt"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});