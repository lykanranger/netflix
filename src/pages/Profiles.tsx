import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle, User } from 'lucide-react';

const AVATAR_COLORS = [
  'bg-red-600',
  'bg-blue-600',
  'bg-green-600',
  'bg-yellow-600',
  'bg-purple-600',
  'bg-pink-600',
  'bg-orange-600',
  'bg-teal-600',
];

export default function Profiles() {
  const { profiles, selectProfile } = useAuth();
  const navigate = useNavigate();

  const handleSelectProfile = (profile: typeof profiles[0]) => {
    selectProfile(profile);
    navigate('/browse');
  };

  const handleCreateProfile = () => {
    navigate('/profiles/create');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <h1 className="text-white text-5xl font-semibold mb-12">Who's watching?</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl">
        {profiles.map((profile, index) => (
          <button
            key={profile.id}
            onClick={() => handleSelectProfile(profile)}
            className="flex flex-col items-center gap-2 group"
          >
            {/* Conditional rendering for the avatar */}
            <div className="w-32 h-32 rounded-lg overflow-hidden group-hover:ring-4 group-hover:ring-white transition-all">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center`}>
                  <User size={64} className="text-white" />
                </div>
              )}
            </div>
            <span className="text-neutral-400 text-lg group-hover:text-white transition-colors">
              {profile.name}
            </span>
          </button>
        ))}

        {profiles.length < 5 && (
          <button
            onClick={handleCreateProfile}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-32 h-32 rounded-lg bg-neutral-800 flex items-center justify-center group-hover:bg-neutral-700 transition-colors">
              <PlusCircle size={64} className="text-neutral-500 group-hover:text-white transition-colors" />
            </div>
            <span className="text-neutral-400 text-lg group-hover:text-white transition-colors">
              Add Profile
            </span>
          </button>
        )}
      </div>

      <button
        onClick={() => navigate('/profiles/manage')}
        className="mt-12 px-6 py-2 border-2 border-neutral-600 text-neutral-400 hover:border-white hover:text-white transition-colors text-lg"
      >
        Manage Profiles
      </button>
    </div>
  );
}
