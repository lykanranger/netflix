import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tmdb, Movie, imageUrl } from '../lib/tmdb';
import Navbar from '../components/Navbar';
import MovieModal from '../components/MovieModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (query) {
      searchMovies();
    }
  }, [query]);

  const searchMovies = async () => {
    setLoading(true);
    try {
      const data = await tmdb.searchMovies(query);
      setResults(data.filter(m => m.poster_path));
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="pt-24 px-4 md:px-12 pb-12">
        <h1 className="text-white text-2xl md:text-3xl font-semibold mb-2">
          Search results for "{query}"
        </h1>
        <p className="text-neutral-400 mb-8">
          {results.length} {results.length === 1 ? 'result' : 'results'} found
        </p>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-neutral-400 text-xl mb-4">No results found</p>
            <p className="text-neutral-500 text-center max-w-md">
              Try searching for something else or browse our collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((movie) => (
              <button
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                className="transition-transform duration-300 hover:scale-110 hover:z-10"
              >
                <img
                  src={imageUrl.w500(movie.poster_path)}
                  alt={movie.title || movie.name}
                  className="w-full rounded-md object-cover"
                  loading="lazy"
                />
                <p className="text-white text-sm mt-2 truncate">
                  {movie.title || movie.name}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
