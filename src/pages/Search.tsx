import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchContent } from '../services/api';
import type { Movie } from '../types/api';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import type { SVGProps } from 'react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [yearFilter, setYearFilter] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [genreFilter, setGenreFilter] = useState<string[]>([]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearched(true);
    setYearFilter('all');
    setMinRating(0);
    setGenreFilter([]);
    
    // Update URL without reload
    setSearchParams({ q: searchQuery });

    try {
      const response = await searchContent(searchQuery);
      if (response.success) {
        setResults(response.data || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [setSearchParams]);

  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(results.map((item) => item.year).filter(Boolean))
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
  }, [results]);

  const extractGenres = (item: Movie) => {
    if (Array.isArray(item.genres)) {
      return item.genres;
    }
    if (Array.isArray(item.genre)) {
      return item.genre;
    }
    if (typeof item.genre === 'string') {
      return item.genre.split(',');
    }

    return [];
  };

  const genres = useMemo(() => {
    const genreMap = new Map<string, string>();

    results.forEach((item) => {
      extractGenres(item)
        .map((genre) => genre.trim())
        .filter(Boolean)
        .forEach((genre) => {
          const key = genre.toLowerCase();
          if (!genreMap.has(key)) {
            genreMap.set(key, genre);
          }
        });
    });

    return Array.from(genreMap.values()).sort((a, b) => a.localeCompare(b));
  }, [results]);

  const filteredResults = useMemo(() => {
    const ratingThreshold = minRating > 0 ? minRating : null;
    const selectedGenres = new Set(genreFilter.map((genre) => genre.toLowerCase()));

    return results.filter((item) => {
      const yearMatches = yearFilter === 'all' || item.year === yearFilter;
      const itemGenres = extractGenres(item)
        .map((genre) => genre.trim().toLowerCase())
        .filter(Boolean);
      const genreMatches =
        selectedGenres.size === 0 || itemGenres.some((genre) => selectedGenres.has(genre));
      const ratingValue = Number(item.rating);
      const ratingMatches =
        ratingThreshold === null ||
        (!Number.isNaN(ratingValue) && ratingValue >= ratingThreshold);

      return yearMatches && ratingMatches && genreMatches;
    });
  }, [genreFilter, minRating, results, yearFilter]);

  const filtersActive = yearFilter !== 'all' || minRating > 0 || genreFilter.length > 0;
  const ratingLabel = minRating > 0 ? minRating.toFixed(1) : 'Any';

  const resetFilters = () => {
    setYearFilter('all');
    setMinRating(0);
    setGenreFilter([]);
  };
  const emptyMessage =
    results.length > 0
      ? 'No results match the selected filters.'
      : 'No results found. Try a different keyword.';

  // Debounce or just search on submit?
  // Let's search on submit to save API calls, but maybe auto-search if query param exists
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [handleSearch, initialQuery]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-20 pt-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={onSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, series, anime..."
              className="w-full bg-gray-900 border border-gray-700 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-lg"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6" />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {searched && (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-4 sm:p-5 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-semibold text-white">Filters</h2>
                <p className="text-sm text-gray-400">
                  Refine results by year or minimum rating.
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

            <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-300" htmlFor="search-year">
                  Year
                </label>
                <select
                  id="search-year"
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
                <label className="text-sm text-gray-300" htmlFor="search-rating">
                  Minimum rating
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="search-rating"
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

            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Genres</label>
                {genreFilter.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {genreFilter.length} selected
                  </span>
                )}
              </div>
              {genres.length === 0 ? (
                <p className="text-xs text-gray-500">Genres are not available for this data.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => {
                    const isSelected = genreFilter.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() =>
                          setGenreFilter((prev) =>
                            prev.includes(genre)
                              ? prev.filter((item) => item !== genre)
                              : [...prev, genre]
                          )
                        }
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          isSelected
                            ? 'border-red-500 bg-red-600 text-white'
                            : 'border-gray-700 text-gray-200 hover:border-red-500/70 hover:text-white'
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
             <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
          </div>
        ) : (
          <>
            {searched && (
              <div className="space-y-6">
                <h2 className="text-xl text-gray-400">
                  Showing{' '}
                  <span className="text-white font-bold">{filteredResults.length}</span>
                  {filtersActive && (
                    <span className="text-gray-500"> of {results.length}</span>
                  )}{' '}
                  results for "{searchParams.get('q')}"
                </h2>
                
                {filteredResults.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {filteredResults.map((movie) => (
                      <MovieCard key={movie.slug} movie={movie} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-500">
                    {emptyMessage}
                  </div>
                )}
              </div>
            )}
            
            {!searched && (
              <div className="text-center py-32 text-gray-600">
                <FilmIcon className="w-20 h-20 mx-auto mb-4 opacity-20" />
                <p className="text-xl">Type something to start searching...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FilmIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18" />
      <path d="M3 7.5h4" />
      <path d="M3 12h18" />
      <path d="M3 16.5h4" />
      <path d="M17 3v18" />
      <path d="M17 7.5h4" />
      <path d="M17 16.5h4" />
    </svg>
  );
}
