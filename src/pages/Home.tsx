import { useEffect, useState } from 'react';
import { getHome, getTrending } from '../services/api';
import type { Movie } from '../types/api';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import MovieCard from '../components/MovieCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [latest, setLatest] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
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
