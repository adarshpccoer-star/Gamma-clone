import { pgEnum, text, uuid, integer, timestamp, pgTable } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm"; // 1. Import relations

export const PresentationStatus = pgEnum("presentation_status", [
  "DRAFT",
  "GENERATING",
  "COMPLETED",
  "FAILED"
]);

export const Presentation = pgTable("presentation", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  style: text("style").notNull(),
  tone: text("tone").notNull(),
  layout: text("layout").notNull(),
  slideCount: integer("slide_count").notNull(),
  status: PresentationStatus("status").default("DRAFT").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const Slide = pgTable("slide", {
  id: uuid("id").primaryKey().defaultRandom(),
  presentationId: uuid("presentation_id")
    .notNull()
    .references(() => Presentation.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  notes: text("notes"),
  imageURL: text("image_url"),
  imagePrompt: text("image_prompt"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Define the Relations for the Relational API
export const presentationRelations = relations(Presentation, ({ many }) => ({
  slides: many(Slide),
}));

export const slideRelations = relations(Slide, ({ one }) => ({
  presentation: one(Presentation, {
    fields: [Slide.presentationId],
    references: [Presentation.id],
  }),
}));