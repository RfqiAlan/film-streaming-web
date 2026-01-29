import { useState, useEffect } from 'react';
import { useCallback, useEffect, useState } from 'react';
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

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearched(true);
    
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
                  Found <span className="text-white font-bold">{results.length}</span> results for "{searchParams.get('q')}"
                </h2>
                
                {results.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {results.map((movie) => (
                      <MovieCard key={movie.slug} movie={movie} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-500">
                    No results found. Try a different keyword.
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
