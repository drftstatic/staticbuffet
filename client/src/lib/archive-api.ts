import { type SearchFilters, type Video } from "@shared/schema";

export async function searchVideos(filters: Partial<SearchFilters>) {
  const params = new URLSearchParams();
  
  if (filters.query) params.set('query', filters.query);
  if (filters.yearFrom) params.set('yearFrom', filters.yearFrom);
  if (filters.yearTo) params.set('yearTo', filters.yearTo);
  if (filters.durationMin) params.set('durationMin', filters.durationMin.toString());
  if (filters.durationMax) params.set('durationMax', filters.durationMax.toString());
  if (filters.license) params.set('license', filters.license);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.rows) params.set('rows', filters.rows.toString());

  const response = await fetch(`/api/search?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getVideoMetadata(identifier: string) {
  const response = await fetch(`/api/metadata/${identifier}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get metadata: ${response.statusText}`);
  }
  
  return response.json();
}

export function generateThumbnailUrl(identifier: string): string {
  return `https://archive.org/services/img/${identifier}`;
}
