import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
  requireProfile?: boolean;
};

export default function ProtectedRoute({ children, requireProfile = false }: ProtectedRouteProps) {
  const { user, profile, loading, profiles } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a user is logged in but has NO profiles, always redirect to create one.
  if (profiles.length === 0 && window.location.pathname !== '/profiles/create') {
    return <Navigate to="/profiles/create" replace />;
  }

  // If this route requires a profile and one isn't selected, redirect to the profile selection screen.
  if (requireProfile && !profile) {
    return <Navigate to="/profiles" replace />;
  }

  return <>{children}</>;
}
