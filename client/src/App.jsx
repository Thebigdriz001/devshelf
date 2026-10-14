import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResourcesPage from './pages/ResourcesPage';
import SnippetsPage from './pages/SnippetsPage';
import TasksPage from './pages/TasksPage';

function App() {
  return (
    <>
      <Navbar />

      <main
        style={{
          maxWidth: '1000px',
          margin: '2rem auto',
          padding: '0 1rem',
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={<Navigate to="/resources" replace />}
            />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/snippets" element={<SnippetsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
          </Route>

          {/* 404 Route */}
          <Route
            path="*"
            element={<h2>404 - Page Not Found</h2>}
          />
        </Routes>
      </main>
    </>
  );
}

export default App;