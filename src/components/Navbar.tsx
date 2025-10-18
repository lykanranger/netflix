import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, User, ChevronDown, LogOut, Settings } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black' : 'bg-gradient-to-b from-black to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate('/browse')}
            className="text-red-600 text-2xl md:text-3xl font-bold tracking-wider"
          >
            NETFLIX
          </button>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate('/browse')}
              className="text-white hover:text-neutral-300 transition-colors"
            >
              HOME
            </button>
            <button
              onClick={() => navigate('/my-list')}
              className="text-white hover:text-neutral-300 transition-colors"
            >
              LIBRARY
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {showSearch ? (
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Titles, people, genres"
                className="bg-black border border-white text-white px-4 py-1 pl-10 w-64 focus:outline-none"
                autoFocus
                onBlur={() => !searchQuery && setShowSearch(false)}
              />
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white" />
            </form>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="text-white hover:text-neutral-300 transition-colors"
            >
              <Search size={24} />
            </button>
          )}

          {/* Bell icon button removed as requested */}

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 text-white hover:text-neutral-300 transition-colors"
            >
              {/* Display profile avatar if available, otherwise show a generic icon */}
              <div className="w-8 h-8 rounded overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-red-600 flex items-center justify-center">
                    <User size={20} />
                  </div>
                )}
              </div>
              <ChevronDown
                size={20}
                className={`transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-95 border border-neutral-700 rounded shadow-lg">
                <div className="p-2">
                  <div className="px-4 py-2 text-white text-sm border-b border-neutral-700">
                    {profile?.name}
                  </div>
                  <button
                    onClick={() => {
                      navigate('/profiles');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Switch Profiles
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
