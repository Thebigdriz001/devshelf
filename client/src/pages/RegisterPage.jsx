import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(userName, email, password);
      // Registration succeeded — send them to login
      navigate('/login');
    } catch (err) {
      // Backend returns { error: "Email already taken" } on 400
      const serverMessage = err.response?.data?.error || 'Registration failed. Please check your inputs.';
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Create an Account</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem', background: '#ffebee', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Username</label>
          <input
            type="text"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}