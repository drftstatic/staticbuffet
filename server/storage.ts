import { type Video, type SearchFilters } from "../shared/schema.js";

export interface IStorage {
  // Archive.org API integration - no server-side storage needed for MVP
  // All data comes directly from Archive.org APIs
}

export class MemStorage implements IStorage {
  constructor() {
    // No storage needed for MVP - all data comes from Archive.org
  }
}

export const storage = new MemStorage();
