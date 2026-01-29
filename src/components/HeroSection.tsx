import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Movie } from '../types/api';

interface HeroSectionProps {
  featured: Movie;
}

export default function HeroSection({ featured }: HeroSectionProps) {
  if (!featured) return null;

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={featured.thumbnail} 
          alt={featured.title}
          className="w-full h-full object-cover object-top opacity-60 mask-image-gradient"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-24 sm:items-center sm:pb-0">
        <div className="max-w-2xl space-y-6">
          <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold tracking-wider uppercase rounded-full">
            Trending Now
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
            {featured.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-300 text-sm sm:text-base font-medium">
            <span className="text-green-400">{featured.rating} Rating</span>
            <span>{featured.year}</span>
            <span className="uppercase border border-gray-600 px-2 rounded text-xs py-0.5">{featured.type}</span>
          </div>
          <div className="flex gap-4 pt-4">
            <Link 
              to={`/watch/${featured.slug}`}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
            >
              <Play className="w-5 h-5 fill-black" />
              Watch Now
            </Link>
            <Link 
              to={`/watch/${featured.slug}`}
              className="flex items-center gap-2 bg-gray-600/60 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600/80 backdrop-blur-sm transition-colors"
            >
              <Info className="w-5 h-5" />
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
