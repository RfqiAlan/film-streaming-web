import type { Movie } from '../types/api';

const STORAGE_KEY = 'recentlyViewed';
const MAX_ITEMS = 10;

const isMovie = (value: unknown): value is Movie => {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;

  return (
    typeof record.title === 'string' &&
    typeof record.slug === 'string' &&
    typeof record.thumbnail === 'string' &&
    typeof record.rating === 'string' &&
    typeof record.year === 'string' &&
    (record.type === 'movie' || record.type === 'series')
  );
};

export const getRecentlyViewed = (): Movie[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isMovie);
  } catch {
    return [];
  }
};

export const addRecentlyViewed = (movie: Movie): Movie[] => {
  if (typeof window === 'undefined') return [];

  const existing = getRecentlyViewed();
  const deduped = existing.filter((item) => item.slug !== movie.slug);
  const updated = [movie, ...deduped].slice(0, MAX_ITEMS);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    return updated;
  }

  return updated;
};
