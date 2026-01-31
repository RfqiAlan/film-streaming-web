import { useEffect, useState } from 'react';
import { getHome, getTrending } from '../services/api';
import type { Movie } from '../types/api';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import MovieCard from '../components/MovieCard';
import { getRecentlyViewed } from '../utils/recentlyViewed';

export default function Home() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [latest, setLatest] = useState<Movie[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const skeletonItems = Array.from({ length: 10 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, homeRes] = await Promise.all([
          getTrending(),
          getHome()
        ]);
        
        if (trendingRes.success) {
           // Sort by rating or pick specific ones for hero? 
           // For now just take the first few as "Top Trending"
           setTrending(trendingRes.data || []);
        }
        
        if (homeRes.success) {
          setLatest(homeRes.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setRecentlyViewed(getRecentlyViewed());
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 pb-20">
        <Navbar />
        <div className="relative h-[70vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/40 to-transparent" />
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-24 sm:items-center sm:pb-0">
            <div className="max-w-2xl space-y-6 animate-pulse">
              <div className="h-6 w-32 bg-gray-800 rounded-full" />
              <div className="h-12 sm:h-16 w-4/5 bg-gray-800 rounded-lg" />
              <div className="flex items-center gap-4">
                <div className="h-4 w-20 bg-gray-800 rounded" />
                <div className="h-4 w-12 bg-gray-800 rounded" />
                <div className="h-4 w-16 bg-gray-800 rounded" />
              </div>
              <div className="flex gap-4 pt-4">
                <div className="h-12 w-32 bg-gray-800 rounded-lg" />
                <div className="h-12 w-32 bg-gray-800 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 space-y-12">
          <section className="space-y-6">
            <div className="h-6 w-44 bg-gray-800 rounded" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {skeletonItems.map((_, index) => (
                <div key={`skeleton-trending-${index}`} className="animate-pulse">
                  <div className="aspect-[2/3] bg-gray-800 rounded-xl" />
                  <div className="mt-3 h-4 bg-gray-800 rounded w-3/4" />
                  <div className="mt-2 h-3 bg-gray-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="h-6 w-44 bg-gray-800 rounded" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {skeletonItems.map((_, index) => (
                <div key={`skeleton-latest-${index}`} className="animate-pulse">
                  <div className="aspect-[2/3] bg-gray-800 rounded-xl" />
                  <div className="mt-3 h-4 bg-gray-800 rounded w-3/4" />
                  <div className="mt-2 h-3 bg-gray-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Pick a random movie from trending to show in Hero
  const heroMovie = trending.length > 0 
    ? trending[Math.floor(Math.random() * Math.min(5, trending.length))] 
    : latest[0];

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <Navbar />
      
      <HeroSection featured={heroMovie} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 space-y-12">
        {recentlyViewed.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-red-600 rounded-full"></span>
              Recently Viewed
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {recentlyViewed.map((movie) => (
                <MovieCard key={movie.slug} movie={movie} />
              ))}
            </div>
          </section>
        )}
        {/* Trending Section */}
        {trending.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-red-600 rounded-full"></span>
              Trending Now
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {trending.slice(0, 10).map((movie) => (
                <MovieCard key={movie.slug} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Latest Updates Section */}
        <section>
           <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-red-600 rounded-full"></span>
              Latest Updates
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {latest.map((movie) => (
                <MovieCard key={movie.slug} movie={movie} />
              ))}
            </div>
        </section>
      </div>
    </div>
  );
}
