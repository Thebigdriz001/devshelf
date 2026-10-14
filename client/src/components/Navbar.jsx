import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1e293b', color: '#fff' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>DevShelf</Link>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Link to="/resources" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Resources</Link>
            <Link to="/snippets" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Snippets</Link>
            <Link to="/tasks" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Tasks</Link>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Hello, {user?.userName}</span>
            <button onClick={handleLogout} style={{ padding: '0.4rem 0.8rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}