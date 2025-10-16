import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, imageUrl } from '../lib/tmdb';

type MovieRowProps = {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
};

export default function MovieRow({ title, movies, onMovieClick }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="px-4 md:px-12 mb-8 group/row">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">{title}</h2>

      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black bg-opacity-50 text-white opacity-0 group-hover/row:opacity-100 hover:bg-opacity-75 transition-all flex items-center justify-center"
        >
          <ChevronLeft size={40} />
        </button>

        <div
          ref={rowRef}
          className="flex gap-2 overflow-x-scroll scrollbar-hide scroll-smooth"
        >
          {movies.map((movie) => (
            <button
              key={`${movie.id}-${movie.title || movie.name}`}
              onClick={() => onMovieClick(movie)}
              className="flex-shrink-0 w-40 md:w-48 transition-transform duration-300 hover:scale-110 hover:z-10"
            >
              <img
                src={imageUrl.w500(movie.poster_path)}
                alt={movie.title || movie.name}
                className="w-full rounded-md object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black bg-opacity-50 text-white opacity-0 group-hover/row:opacity-100 hover:bg-opacity-75 transition-all flex items-center justify-center"
        >
          <ChevronRight size={40} />
        </button>
      </div>
    </div>
  );
}
