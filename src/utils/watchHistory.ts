import type { Movie } from '../types/api';

export interface WatchHistoryItem extends Movie {
  watchedAt: string;
}

const STORAGE_KEY = 'watchHistory';
const MAX_ITEMS = 50;

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

const isHistoryItem = (value: unknown): value is WatchHistoryItem => {
  if (!isMovie(value)) return false;
  const record = value as { watchedAt?: unknown };

  return typeof record.watchedAt === 'string';
};

export const getWatchHistory = (): WatchHistoryItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryItem);
  } catch {
    return [];
  }
};

export const addWatchHistory = (movie: Movie): WatchHistoryItem[] => {
  if (typeof window === 'undefined') return [];

  const existing = getWatchHistory();
  const deduped = existing.filter((item) => item.slug !== movie.slug);
  const updatedItem: WatchHistoryItem = {
    ...movie,
    watchedAt: new Date().toISOString(),
  };
  const updated = [updatedItem, ...deduped].slice(0, MAX_ITEMS);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    return updated;
  }

  return updated;
};

export const clearWatchHistory = (): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
};
