import { useState, useEffect } from 'react';
import { tmdb, Movie } from '../lib/tmdb';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Browse() {
  const [loading, setLoading] = useState(true);
  const [netflixOriginals, setNetflixOriginals] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  const [horrorMovies, setHorrorMovies] = useState<Movie[]>([]);
  const [romanceMovies, setRomanceMovies] = useState<Movie[]>([]);
  const [documentaries, setDocumentaries] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const [
        originalsData,
        trendingData,
        topRatedData,
        actionData,
        comedyData,
        horrorData,
        romanceData,
        documentariesData,
      ] = await Promise.all([
        tmdb.getNetflixOriginals(),
        tmdb.getTrending(),
        tmdb.getTopRated(),
        tmdb.getActionMovies(),
        tmdb.getComedyMovies(),
        tmdb.getHorrorMovies(),
        tmdb.getRomanceMovies(),
        tmdb.getDocumentaries(),
      ]);

      setNetflixOriginals(originalsData);
      setTrending(trendingData);
      setTopRated(topRatedData);
      setActionMovies(actionData);
      setComedyMovies(comedyData);
      setHorrorMovies(horrorData);
      setRomanceMovies(romanceData);
      setDocumentaries(documentariesData);
    } catch (error) {
      console.error('Error loading movies:', error);
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
      <Banner movies={netflixOriginals} onInfoClick={setSelectedMovie} />

      <div className="relative -mt-32 z-20">
        <MovieRow title="Netflix Originals" movies={netflixOriginals} onMovieClick={setSelectedMovie} />
        <MovieRow title="Trending Now" movies={trending} onMovieClick={setSelectedMovie} />
        <MovieRow title="Top Rated" movies={topRated} onMovieClick={setSelectedMovie} />
        <MovieRow title="Action Movies" movies={actionMovies} onMovieClick={setSelectedMovie} />
        <MovieRow title="Comedy Movies" movies={comedyMovies} onMovieClick={setSelectedMovie} />
        <MovieRow title="Horror Movies" movies={horrorMovies} onMovieClick={setSelectedMovie} />
        <MovieRow title="Romance Movies" movies={romanceMovies} onMovieClick={setSelectedMovie} />
        <MovieRow title="Documentaries" movies={documentaries} onMovieClick={setSelectedMovie} />
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
