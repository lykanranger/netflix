import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Profiles from './pages/Profiles';
import CreateProfile from './pages/CreateProfile';
import ManageProfiles from './pages/ManageProfiles';
import Browse from './pages/Browse';
import MyList from './pages/MyList';
import Search from './pages/Search';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/profiles"
            element={
              <ProtectedRoute>
                <Profiles />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profiles/create"
            element={
              <ProtectedRoute>
                <CreateProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profiles/manage"
            element={
              <ProtectedRoute>
                <ManageProfiles />
              </ProtectedRoute>
            }
          />

          <Route
            path="/browse"
            element={
              <ProtectedRoute requireProfile>
                <Browse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-list"
            element={
              <ProtectedRoute requireProfile>
                <MyList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute requireProfile>
                <Search />
              </ProtectedRoute>
            }
          />

          {/* This is the only line that has changed */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;