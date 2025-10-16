import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// A list of predefined avatars to choose from
const AVATARS = [
  'https://robohash.org/1?set=set4',
  'https://robohash.org/2?set=set4',
  'https://robohash.org/3?set=set4',
  'https://robohash.org/4?set=set4',
  'https://robohash.org/5?set=set4',
  'https://robohash.org/6?set=set4',
  'https://robohash.org/7?set=set4',
  'https://robohash.org/8?set=set4',
];

export default function CreateProfile() {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isKids, setIsKids] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, loadProfiles } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!name.trim()) {
      setError('Please enter a name for the profile.');
      return;
    }
    if (!selectedAvatar) {
      setError('Please select an avatar.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('profiles').insert({
        user_id: user.id,
        name,
        is_kids: isKids,
        avatar_url: selectedAvatar,
      });

      if (insertError) throw insertError;

      await loadProfiles();
      navigate('/profiles');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-white text-5xl font-semibold mb-4 text-center">Add Profile</h1>
        <p className="text-neutral-400 mb-8 text-center">
          Add a profile for another person watching.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-orange-500 text-white p-3 rounded text-sm text-center">
              {error}
            </div>
          )}

          <div className="border-t border-neutral-700 pt-6">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-700 text-white rounded border border-neutral-600 focus:border-white focus:outline-none"
            />
          </div>
          
          <div className="pt-2">
            <h2 className="text-lg text-neutral-400 mb-4 text-center">Choose an Avatar</h2>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 justify-center">
                {AVATARS.map((avatarUrl) => (
                    <button
                        type="button"
                        key={avatarUrl}
                        onClick={() => setSelectedAvatar(avatarUrl)}
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden transition-transform transform hover:scale-110 ${selectedAvatar === avatarUrl ? 'ring-4 ring-white' : ''}`}
                    >
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="kids"
              checked={isKids}
              onChange={(e) => setIsKids(e.target.checked)}
              className="w-5 h-5"
            />
            <label htmlFor="kids" className="text-white">
              Kid?
            </label>
          </div>

          <div className="flex gap-4 border-t border-neutral-700 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 bg-white text-black font-semibold hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Continue'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profiles')}
              className="px-8 py-2 border-2 border-neutral-600 text-neutral-400 hover:border-white hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

