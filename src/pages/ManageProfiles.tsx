import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Pencil, User } from 'lucide-react';

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

export default function ManageProfiles() {
  const { profiles, loadProfiles } = useAuth();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleEdit = (profile: typeof profiles[0]) => {
    setEditingId(profile.id);
    setEditName(profile.name);
  };

  const handleSave = async (profileId: string) => {
    await supabase
      .from('profiles')
      .update({ name: editName })
      .eq('id', profileId);

    await loadProfiles();
    setEditingId(null);
  };

  const handleDelete = async (profileId: string) => {
    if (profiles.length === 1) {
      alert('You must have at least one profile');
      return;
    }

    if (confirm('Are you sure you want to delete this profile?')) {
      await supabase.from('profiles').delete().eq('id', profileId);
      await loadProfiles();
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <h1 className="text-white text-5xl font-semibold mb-4">Manage Profiles</h1>
      <p className="text-neutral-400 mb-12">Edit or delete profiles.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mb-8">
        {profiles.map((profile, index) => (
          <div key={profile.id} className="flex flex-col items-center gap-2">
            <div className="relative group">
              <div className={`w-32 h-32 rounded-lg ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center`}>
                <User size={64} className="text-white" />
              </div>
              <button
                onClick={() => handleEdit(profile)}
                className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Pencil size={32} className="text-white" />
              </button>
            </div>

            {editingId === profile.id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="px-2 py-1 bg-neutral-700 text-white rounded border border-neutral-600 focus:border-white focus:outline-none text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(profile.id)}
                    className="px-3 py-1 bg-white text-black text-xs rounded hover:bg-neutral-300"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <span className="text-neutral-400 text-lg">{profile.name}</span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/profiles')}
        className="px-6 py-2 border-2 border-neutral-600 text-neutral-400 hover:border-white hover:text-white transition-colors text-lg"
      >
        Done
      </button>
    </div>
  );
}
