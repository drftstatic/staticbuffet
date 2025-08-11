import { type SearchFilters, type Video } from "@shared/schema";
import { type SearchState } from "./types";

export async function searchVideos(filters: SearchState) {
  const params = new URLSearchParams();
  
  if (filters.query) params.set('query', filters.query);
  if (filters.yearFrom) params.set('yearFrom', filters.yearFrom);
  if (filters.yearTo) params.set('yearTo', filters.yearTo);
  
  // Map duration filter to min/max
  if (filters.duration === 'short') {
    params.set('durationMax', '300'); // 5 minutes
  } else if (filters.duration === 'medium') {
    params.set('durationMin', '300');
    params.set('durationMax', '1800'); // 30 minutes
  } else if (filters.duration === 'long') {
    params.set('durationMin', '1800');
  }
  
  if (filters.license) params.set('license', filters.license);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page) params.set('page', filters.page.toString());
  
  // Set default rows if not specified
  params.set('rows', '50');

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
