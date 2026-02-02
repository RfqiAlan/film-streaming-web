import { useState } from 'react';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { clearWatchHistory, getWatchHistory, type WatchHistoryItem } from '../utils/watchHistory';
import { History, Trash2 } from 'lucide-react';

export default function WatchHistory() {
  const [history, setHistory] = useState<WatchHistoryItem[]>(() => getWatchHistory());

  const handleClear = () => {
    clearWatchHistory();
    setHistory([]);
  };

  const formatWatchedAt = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-20 pt-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <History className="w-6 h-6 text-red-600" />
              Riwayat Tontonan
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {history.length} item
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            disabled={history.length === 0}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Riwayat
          </button>
        </div>

        {history.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {history.map((item) => (
              <div key={`${item.slug}-${item.watchedAt}`} className="space-y-2">
                <MovieCard movie={item} />
                <div className="text-xs text-gray-500 px-1">
                  Terakhir ditonton:{' '}
                  <span className="text-gray-300">
                    {formatWatchedAt(item.watchedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-500">
            <p className="text-lg font-medium text-gray-300">
              Belum ada riwayat tontonan.
            </p>
            <p className="text-sm text-gray-500">
              Mulai tonton film atau series untuk melihat daftar di sini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
