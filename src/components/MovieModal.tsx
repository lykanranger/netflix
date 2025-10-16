import { useEffect, useState } from 'react';
import { X, Play, Plus, Check, Volume2, VolumeX } from 'lucide-react';
import { Movie, MovieDetails, tmdb, imageUrl } from '../lib/tmdb';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type MovieModalProps = {
  movie: Movie;
  onClose: () => void;
};

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInList, setIsInList] = useState(false);
  const [muted, setMuted] = useState(true);
  const { profile } = useAuth();

  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');

  useEffect(() => {
    loadDetails();
    checkIfInList();
  }, [movie.id]);

  const loadDetails = async () => {
    try {
      const data = await tmdb.getMovieDetails(movie.id, mediaType);
      setDetails(data);
    } catch (error) {
      console.error('Error loading movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfInList = async () => {
    if (!profile) return;

    const { data } = await supabase
      .from('my_list')
      .select('id')
      .eq('profile_id', profile.id)
      .eq('movie_id', movie.id)
      .eq('media_type', mediaType)
      .maybeSingle();

    setIsInList(!!data);
  };

  const toggleMyList = async () => {
    if (!profile) return;

    if (isInList) {
      await supabase
        .from('my_list')
        .delete()
        .eq('profile_id', profile.id)
        .eq('movie_id', movie.id)
        .eq('media_type', mediaType);
      setIsInList(false);
    } else {
      await supabase.from('my_list').insert({
        profile_id: profile.id,
        movie_id: movie.id,
        media_type: mediaType,
        title: movie.title || movie.name || '',
        poster_path: movie.poster_path || '',
      });
      setIsInList(true);
    }
  };

  const trailer = details?.videos?.results.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative bg-neutral-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center text-white hover:bg-neutral-800 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="relative aspect-video">
          {trailer ? (
            <div className="relative w-full h-full">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&modestbranding=1`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
              <button
                onClick={() => setMuted(!muted)}
                className="absolute bottom-4 right-4 w-10 h-10 bg-neutral-900 bg-opacity-70 rounded-full flex items-center justify-center text-white hover:bg-opacity-90 transition-colors"
              >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          ) : (
            <img
              src={imageUrl.original(movie.backdrop_path || movie.poster_path)}
              alt={movie.title || movie.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-900 to-transparent" />
        </div>

        <div className="p-8">
          <div className="flex gap-3 mb-6">
            <button className="flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded hover:bg-opacity-80 transition-all">
              <Play size={24} fill="currentColor" />
              <span>Play</span>
            </button>

            <button
              onClick={toggleMyList}
              className="w-12 h-12 border-2 border-neutral-500 rounded-full flex items-center justify-center text-white hover:border-white transition-colors"
            >
              {isInList ? <Check size={24} /> : <Plus size={24} />}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-green-500 font-semibold">
                  {Math.round((movie.vote_average || 0) * 10)}% Match
                </span>
                <span className="text-neutral-400">
                  {movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}
                </span>
                {details?.runtime && (
                  <span className="text-neutral-400">{details.runtime} min</span>
                )}
                {details?.number_of_seasons && (
                  <span className="text-neutral-400">
                    {details.number_of_seasons} Season{details.number_of_seasons > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <p className="text-white text-lg leading-relaxed mb-6">{movie.overview}</p>

              {details?.genres && details.genres.length > 0 && (
                <div className="text-neutral-400 text-sm">
                  <span className="text-neutral-500">Genres: </span>
                  {details.genres.map((g) => g.name).join(', ')}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
