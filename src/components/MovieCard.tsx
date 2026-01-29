import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Movie } from '../types/api';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link to={`/watch/${movie.slug}`} className="group relative block bg-gray-900 rounded-xl overflow-hidden transition-transform hover:scale-105 hover:z-10 duration-300">
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img 
          src={movie.thumbnail} 
          alt={movie.title}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-bold text-lg line-clamp-2 leading-tight">{movie.title}</h3>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-300">
          <span className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-yellow-400" />
            {movie.rating}
          </span>
          <span>•</span>
          <span>{movie.year}</span>
          <span className="ml-auto text-xs px-2 py-1 bg-white/20 rounded-md uppercase">{movie.type}</span>
        </div>
      </div>
      <div className="p-3 sm:hidden">
        <h3 className="text-white font-semibold text-sm line-clamp-1">{movie.title}</h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            {movie.rating}
        </div>
      </div>
    </Link>
  );
}
