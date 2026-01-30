import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getMovies, getSeries } from '../services/api';
import type { Movie } from '../types/api';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface CatalogProps {
  type: 'movies' | 'series';
}

export default function Catalog({ type }: CatalogProps) {
  const [items, setItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [yearFilter, setYearFilter] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const location = useLocation();

  // Reset page when switching between movies/series via nav
  useEffect(() => {
    setPage(1);
    setItems([]);
    setHasMore(true);
    setYearFilter('all');
    setMinRating(0);
  }, [type, location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchFn = type === 'movies' ? getMovies : getSeries;
        const response = await fetchFn(page);
        
        if (response.success && response.data) {
          // If it's page 1, replace. If >1, append? 
          // For simple pagination UI, usually replace is cleaner unless infinite scroll.
          // Let's stick to standard pagination (replace items).
          setItems(response.data);
          
          // Simple check for "has more": if we got fewer items than usually returned (e.g. 20), maybe end?
          // API doesn't seem to give "total_pages" clearly, but gives "total". 
          // Let's assume if data array is empty, no more pages.
          if (response.data.length === 0) {
            setHasMore(false);
          } else {
              setHasMore(true);
          }
        }
      } catch (error) {
        console.error(`Failed to fetch ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [type, page]);

  const title = type === 'movies' ? 'Movies' : 'TV Series';
  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(items.map((item) => item.year).filter(Boolean))
    );

    return uniqueYears.sort((a, b) => {
      const aNum = Number(a);
      const bNum = Number(b);

      if (Number.isNaN(aNum) && Number.isNaN(bNum)) {
        return a.localeCompare(b);
      }
      if (Number.isNaN(aNum)) return 1;
      if (Number.isNaN(bNum)) return -1;
      return bNum - aNum;
    });
  }, [items]);

  const filteredItems = useMemo(() => {
    const ratingThreshold = minRating > 0 ? minRating : null;

    return items.filter((item) => {
      const yearMatches = yearFilter === 'all' || item.year === yearFilter;
      const ratingValue = Number(item.rating);
      const ratingMatches =
        ratingThreshold === null ||
        (!Number.isNaN(ratingValue) && ratingValue >= ratingThreshold);

      return yearMatches && ratingMatches;
    });
  }, [items, minRating, yearFilter]);

  const filtersActive = yearFilter !== 'all' || minRating > 0;
  const ratingLabel = minRating > 0 ? minRating.toFixed(1) : 'Any';

  const resetFilters = () => {
    setYearFilter('all');
    setMinRating(0);
  };

  const emptyMessage =
    items.length > 0
      ? 'No items match the selected filters.'
      : 'No items found.';

  return (
    <div className="min-h-screen bg-gray-950 pb-20 pt-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-3xl font-bold text-white capitalize">{title}</h1>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Page {page}</span>
              <span>•</span>
              <span>
                {filteredItems.length} of {items.length} items
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-semibold text-white">Filters</h2>
                <p className="text-sm text-gray-400">
                  Narrow results by year or minimum rating.
                </p>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                disabled={!filtersActive}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset filters
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-300" htmlFor="catalog-year">
                  Year
                </label>
                <select
                  id="catalog-year"
                  value={yearFilter}
                  onChange={(event) => setYearFilter(event.target.value)}
                  className="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                >
                  <option value="all">All years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-300" htmlFor="catalog-rating">
                  Minimum rating
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="catalog-rating"
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={minRating}
                    onChange={(event) => setMinRating(Number(event.target.value))}
                    className="w-full accent-red-600"
                  />
                  <span className="min-w-[3.5rem] text-sm text-white">
                    {ratingLabel}
                  </span>
                </div>
                <span className="text-xs text-gray-500">0 means any rating.</span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
          </div>
        ) : (
          <>
            {filteredItems.length > 0 ? (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {filteredItems.map((item) => (
                  <MovieCard key={`${item.slug}-${item.year}`} movie={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                {emptyMessage}
              </div>
            )}

            {/* Pagination Controls */}
            <div className="mt-12 flex justify-center gap-4">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="flex items-center gap-2 px-6 py-2 bg-gray-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore || loading || items.length === 0}
                className="flex items-center gap-2 px-6 py-2 bg-gray-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
