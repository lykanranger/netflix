import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        navigate('/profiles/create');
      } else {
        await signIn(email, password);
        navigate('/profiles');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: 'black',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
        }}
      />

      <div className="relative z-10 w-full max-w-md p-8 bg-black bg-opacity-75 rounded-md">
        <h1 className="text-white text-3xl font-bold mb-8 text-center">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-orange-500 text-white p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-700 text-white rounded border border-neutral-600 focus:border-white focus:outline-none"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-700 text-white rounded border border-neutral-600 focus:border-white focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-neutral-400 text-sm">
          {isSignUp ? 'Already have an account?' : 'New to Netflix?'}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white hover:underline"
          >
            {isSignUp ? 'Sign in now' : 'Sign up now'}
          </button>
        </div>
      </div>
    </div>
  );
}
