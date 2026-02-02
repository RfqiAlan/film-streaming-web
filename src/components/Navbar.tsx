import { Film, History, Home, Search, Tv } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-red-500 font-bold text-xl">
            <Film className="w-8 h-8" />
            <span>PixStream</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`flex items-center gap-2 hover:text-white transition-colors ${isActive('/') ? 'text-white' : 'text-gray-400'}`}
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link 
              to="/movies" 
              className={`flex items-center gap-2 hover:text-white transition-colors ${isActive('/movies') ? 'text-white' : 'text-gray-400'}`}
            >
              <Film className="w-5 h-5" />
              <span className="hidden sm:inline">Movies</span>
            </Link>
            <Link 
              to="/series" 
              className={`flex items-center gap-2 hover:text-white transition-colors ${isActive('/series') ? 'text-white' : 'text-gray-400'}`}
            >
              <Tv className="w-5 h-5" />
              <span className="hidden sm:inline">Series</span>
            </Link>
            <Link 
              to="/search" 
              className={`flex items-center gap-2 hover:text-white transition-colors ${isActive('/search') ? 'text-white' : 'text-gray-400'}`}
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Search</span>
            </Link>
            <Link 
              to="/history" 
              className={`flex items-center gap-2 hover:text-white transition-colors ${isActive('/history') ? 'text-white' : 'text-gray-400'}`}
            >
              <History className="w-5 h-5" />
              <span className="hidden sm:inline">Riwayat</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
