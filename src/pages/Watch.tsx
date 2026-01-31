import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDetail } from '../services/api';
import type { Movie, MovieDetail, Episode } from '../types/api';
import Navbar from '../components/Navbar';
import VideoPlayer from '../components/VideoPlayer';
import { Loader2, Calendar, Star, Globe, PlayCircle } from 'lucide-react';
import { addRecentlyViewed } from '../utils/recentlyViewed';

export default function Watch() {
  const { slug } = useParams<{ slug: string }>();
  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSource, setCurrentSource] = useState<string>('');
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const response = await getDetail(slug);
        if (response.success && response.data) {
          setDetail(response.data);
          
          // Determine initial player URL
          // If episodes exist, pick the first one. Otherwise use main player_url
          if (response.data.episodes && response.data.episodes.length > 0) {
             const firstEp = response.data.episodes[0];
             setActiveEpisode(firstEp);
             setCurrentSource(firstEp.player_url);
          } else {
             setCurrentSource(response.data.player_url);
          }
        }
      } catch (error) {
        console.error("Failed to fetch detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!detail) return;

    const viewedItem: Movie = {
      title: detail.title,
      slug: detail.slug,
      thumbnail: detail.thumbnail,
      rating: detail.rating,
      year: detail.year,
      type: detail.episodes && detail.episodes.length > 0 ? 'series' : 'movie',
    };

    addRecentlyViewed(viewedItem);
  }, [detail]);

  const handleEpisodeChange = (episode: Episode) => {
    setActiveEpisode(episode);
    setCurrentSource(episode.player_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        Content not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-20 pt-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Player & Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Player */}
            <div className="space-y-4">
               <VideoPlayer url={currentSource} />
               <div className="flex items-center justify-between text-sm text-gray-400 px-1">
                  <span>Server ID: {activeEpisode ? activeEpisode.sources_id : detail.sources_id}</span>
                  {activeEpisode && (
                    <span className="text-white font-medium">
                       S{activeEpisode.season} : E{activeEpisode.episode} - {activeEpisode.title}
                    </span>
                  )}
               </div>
            </div>

            {/* Info */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h1 className="text-3xl font-bold text-white mb-4">{detail.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-6">
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  {detail.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {detail.year}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {detail.country}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Synopsis</h3>
                  <p className="text-gray-400 leading-relaxed">{detail.synopsis}</p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {detail.genres.map(g => (
                        <span key={g} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Cast</h3>
                     <div className="flex flex-wrap gap-2">
                      {detail.cast.map(c => (
                        <span key={c} className="text-sm text-gray-400">
                          {c},
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Episodes / Poster */}
          <div className="space-y-8">
             {/* Poster for Context */}
             <div className="hidden lg:block aspect-[2/3] rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={detail.thumbnail} 
                  alt={detail.title} 
                  className="w-full h-full object-cover"
                />
             </div>

             {/* Episodes List */}
             {detail.episodes && detail.episodes.length > 0 && (
               <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                 <div className="p-4 border-b border-gray-800 bg-gray-900">
                   <h3 className="font-bold text-white flex items-center gap-2">
                     <PlayCircle className="w-5 h-5 text-red-600" />
                     Episodes
                   </h3>
                 </div>
                 <div className="max-h-[500px] overflow-y-auto custom-scrollbar p-2 space-y-2">
                   {detail.episodes.map((ep, idx) => {
                      const isActive = activeEpisode?.episode === ep.episode && activeEpisode?.season === ep.season;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleEpisodeChange(ep)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left group ${
                            isActive 
                              ? 'bg-red-600 text-white' 
                              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black/20 rounded font-bold text-sm">
                            {ep.episode}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="text-sm font-medium truncate">{ep.title}</div>
                             <div className={`text-xs ${isActive ? 'text-red-100' : 'text-gray-500'}`}>Season {ep.season}</div>
                          </div>
                          {isActive && <PlayCircle className="w-5 h-5 fill-white text-red-600" />}
                        </button>
                      );
                   })}
                 </div>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
