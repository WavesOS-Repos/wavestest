import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const downloads = pgTable("downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  downloadCount: integer("download_count").notNull().default(0),
  fileType: text("file_type").notNull(), // 'iso' or 'wrapper'
});

export const insertDownloadSchema = createInsertSchema(downloads).pick({
  filename: true,
  fileType: true,
});

export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type Download = typeof downloads.$inferSelect;
