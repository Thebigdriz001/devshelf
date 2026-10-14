import { useState, useEffect } from 'react';
import api from '../api/client';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('docs');

  // 1. Fetch all resources for the logged-in user
  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resources');
      setResources(res.data);
    } catch (err) {
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // 2. Create a new resource
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/resources', { title, url, notes, type });
      // Prepend the new resource to the list
      setResources([res.data, ...resources]);
      // Reset form
      setTitle('');
      setUrl('');
      setNotes('');
      setType('docs');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create resource');
    }
  };

  // 3. Delete a resource
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      await api.delete(`/resources/${id}`);
      setResources(resources.filter((r) => r.id !== id));
    } catch (err) {
      alert('Failed to delete resource');
    }
  };

  return (
    <div>
      <h1>Developer Resources</h1>
      <p>Bookmark useful documentation, tools, and tutorials.</p>

      {/* Create Form */}
      <form onSubmit={handleCreate} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
        <h3>Add New Resource</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem' }}>Title *</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. React 19 Docs" style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem' }}>URL *</label>
            <input required type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://react.dev" style={{ width: '100%', padding: '0.5rem' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem' }}>Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Key takeaways or instructions" style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem' }}>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
              <option value="docs">Documentation</option>
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="tool">Tool</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Save Resource
        </button>
      </form>

      {/* Items List */}
      {loading ? (
        <p>Loading resources...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : resources.length === 0 ? (
        <p>No resources found. Create your first bookmark above!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {resources.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <div>
                <a href={item.url} target="_blank" rel="noreferrer" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0284c7' }}>
                  {item.title}
                </a>
                <span style={{ marginLeft: '0.75rem', padding: '0.2rem 0.5rem', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontSize: '0.8rem' }}>
                  {item.type}
                </span>
                {item.notes && <p style={{ margin: '0.5rem 0 0 0', color: '#475569', fontSize: '0.9rem' }}>{item.notes}</p>}
              </div>

              <button onClick={() => handleDelete(item.id)} style={{ padding: '0.4rem 0.8rem', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}