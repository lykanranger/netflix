import { useState, useEffect } from 'react';
import { supabase, MyListItem } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Movie, imageUrl } from '../lib/tmdb';
import Navbar from '../components/Navbar';
import MovieModal from '../components/MovieModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MyList() {
  const [loading, setLoading] = useState(true);
  const [myList, setMyList] = useState<MyListItem[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      loadMyList();
    }
  }, [profile]);

  const loadMyList = async () => {
    if (!profile) return;

    try {
      const { data } = await supabase
        .from('my_list')
        .select('*')
        .eq('profile_id', profile.id)
        .order('added_at', { ascending: false });

      if (data) {
        setMyList(data);
      }
    } catch (error) {
      console.error('Error loading my list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (item: MyListItem) => {
    const movie: Movie = {
      id: item.movie_id,
      title: item.title,
      overview: '',
      poster_path: item.poster_path,
      backdrop_path: item.poster_path,
      vote_average: 0,
      media_type: item.media_type,
    };
    setSelectedMovie(movie);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="pt-24 px-4 md:px-12 pb-12">
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-8">MY FAVOURITES</h1>

        {myList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-neutral-400 text-xl mb-4">Your list is empty</p>
            <p className="text-neutral-500 text-center max-w-md">
              Add movies and shows to your list by clicking the plus icon when viewing content details.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {myList.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMovieClick(item)}
                className="transition-transform duration-300 hover:scale-110 hover:z-10"
              >
                <img
                  src={imageUrl.w500(item.poster_path)}
                  alt={item.title}
                  className="w-full rounded-md object-cover"
                  loading="lazy"
                />
                <p className="text-white text-sm mt-2 truncate">{item.title}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => {
            setSelectedMovie(null);
            loadMyList();
          }}
        />
      )}
    </div>
  );
}
