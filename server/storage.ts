import { type Download, type InsertDownload } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getDownload(filename: string): Promise<Download | undefined>;
  createDownload(download: InsertDownload): Promise<Download>;
  incrementDownload(filename: string, fileType: string): Promise<Download>;
  getDownloadStats(): Promise<{ iso: number; wrapper: number; total: number }>;
}

export class MemStorage implements IStorage {
  private downloads: Map<string, Download>;

  constructor() {
    this.downloads = new Map();
    
    // Initialize with default download entries
    const isoDownload: Download = {
      id: randomUUID(),
      filename: "wavesinstaller_ultra.iso",
      downloadCount: 0,
      fileType: "iso"
    };
    
    const wrapperDownload: Download = {
      id: randomUUID(),
      filename: "waves_wrapper.zip",
      downloadCount: 0,
      fileType: "wrapper"
    };
    
    this.downloads.set(isoDownload.filename, isoDownload);
    this.downloads.set(wrapperDownload.filename, wrapperDownload);
  }

  async getDownload(filename: string): Promise<Download | undefined> {
    return this.downloads.get(filename);
  }

  async createDownload(insertDownload: InsertDownload): Promise<Download> {
    const id = randomUUID();
    const download: Download = { 
      ...insertDownload, 
      id, 
      downloadCount: 0 
    };
    this.downloads.set(download.filename, download);
    return download;
  }

  async incrementDownload(filename: string, fileType: string): Promise<Download> {
    let download = this.downloads.get(filename);
    
    if (!download) {
      download = await this.createDownload({ filename, fileType });
    }
    
    download.downloadCount += 1;
    this.downloads.set(filename, download);
    return download;
  }

  async getDownloadStats(): Promise<{ iso: number; wrapper: number; total: number }> {
    let isoCount = 0;
    let wrapperCount = 0;
    
    for (const download of Array.from(this.downloads.values())) {
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

export const storage = new MemStorage();
