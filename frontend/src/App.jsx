import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Buildings from './pages/Buildings';
import Units from './pages/Units';
import Tenants from './pages/Tenants';
import Payments from './pages/Payments';
import Outstanding from './pages/Outstanding';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route
          path="/"
          element={(
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/buildings"
          element={(
            <ProtectedRoute>
              <Buildings />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/buildings/:buildingId/units"
          element={(
            <ProtectedRoute>
              <Units />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/tenants"
          element={(
            <ProtectedRoute>
              <Tenants />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/payments"
          element={(
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/outstanding"
          element={(
            <ProtectedRoute>
              <Outstanding />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/profile"
          element={(
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
