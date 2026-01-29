import { useEffect, useState } from 'react';
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
  const location = useLocation();

  // Reset page when switching between movies/series via nav
  useEffect(() => {
    setPage(1);
    setItems([]);
    setHasMore(true);
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

  return (
    <div className="min-h-screen bg-gray-950 pb-20 pt-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white capitalize">{title}</h1>
          <div className="text-gray-400 text-sm">Page {page}</div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
          </div>
        ) : (
          <>
            {items.length > 0 ? (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {items.map((item) => (
                  <MovieCard key={`${item.slug}-${item.year}`} movie={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                No items found.
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
