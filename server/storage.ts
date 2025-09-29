import { type Download, type InsertDownload, downloads } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";

export interface IStorage {
  getDownload(filename: string): Promise<Download | undefined>;
  createDownload(download: InsertDownload): Promise<Download>;
  incrementDownload(filename: string, fileType: string): Promise<Download>;
  getDownloadStats(): Promise<{ iso: number; wrapper: number; total: number }>;
}

import { eq, sql } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getDownload(filename: string): Promise<Download | undefined> {
    const [download] = await db.select().from(downloads).where(eq(downloads.filename, filename));
    return download || undefined;
  }

  async createDownload(insertDownload: InsertDownload): Promise<Download> {
    const [download] = await db
      .insert(downloads)
      .values(insertDownload)
      .returning();
    return download;
  }

  async incrementDownload(filename: string, fileType: string): Promise<Download> {
    let download = await this.getDownload(filename);
    
    if (!download) {
      download = await this.createDownload({ filename, fileType });
    }
    
    const [updatedDownload] = await db
      .update(downloads)
      .set({ downloadCount: sql`${downloads.downloadCount} + 1` })
      .where(eq(downloads.filename, filename))
      .returning();
    
    return updatedDownload;
  }

  async getDownloadStats(): Promise<{ iso: number; wrapper: number; total: number }> {
    const allDownloads = await db.select().from(downloads);
    
    let isoCount = 0;
    let wrapperCount = 0;
    
    for (const download of allDownloads) {
      if (download.fileType === "iso") {
        isoCount += download.downloadCount;
      } else if (download.fileType === "wrapper") {
        wrapperCount += download.downloadCount;
      }
    }
    
    return {
      iso: isoCount,
      wrapper: wrapperCount,
      total: isoCount + wrapperCount
    };
  }
}

export const storage = new DatabaseStorage();
