import { useState, useEffect } from 'react';
import api from '../api/client';

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState('');

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/snippets');
      setSnippets(res.data);
    } catch (err) {
      alert('Failed to load snippets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/snippets', { title, description, code, language, tags });
      setSnippets([res.data, ...snippets]);
      setTitle('');
      setDescription('');
      setCode('');
      setTags('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create snippet');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this code snippet?')) return;
    try {
      await api.delete(`/snippets/${id}`);
      setSnippets(snippets.filter((s) => s.id !== id));
    } catch (err) {
      alert('Failed to delete snippet');
    }
  };

  return (
    <div>
      <h1>Code Snippets</h1>
      <p>Save reusable code blocks with syntax highlighting language labels.</p>

      {/* Snippet Form */}
      <form onSubmit={handleCreate} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
        <h3>Add New Code Snippet</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem' }}>Title *</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Axios Request Interceptor" style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem' }}>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="csharp">C# (.NET)</option>
              <option value="python">Python</option>
              <option value="sql">SQL</option>
              <option value="plaintext">Plaintext</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem' }}>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief summary of what this code does" style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem' }}>Code Block *</label>
          <textarea
            required
            rows={5}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste code snippet here..."
            style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem' }}>Tags (comma-separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, axios, auth" style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#0f766e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Save Snippet
        </button>
      </form>

      {/* List */}
      {loading ? (
        <p>Loading snippets...</p>
      ) : snippets.length === 0 ? (
        <p>No snippets saved yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {snippets.map((s) => (
            <div key={s.id} style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '0.75rem 1rem' }}>
                <div>
                  <strong>{s.title}</strong>
                  <span style={{ marginLeft: '0.5rem', padding: '0.2rem 0.5rem', background: '#e2e8f0', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    {s.language}
                  </span>
                </div>
                <button onClick={() => handleDelete(s.id)} style={{ padding: '0.3rem 0.6rem', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>

              {s.description && <p style={{ padding: '0.5rem 1rem', margin: 0, fontSize: '0.9rem', color: '#475569' }}>{s.description}</p>}

              <pre style={{ margin: 0, padding: '1rem', background: '#1e293b', color: '#f8fafc', overflowX: 'auto', fontSize: '0.85rem' }}>
                <code>{s.code}</code>
              </pre>

              {s.tags && (
                <div style={{ padding: '0.5rem 1rem', background: '#f8fafc', fontSize: '0.8rem', color: '#64748b' }}>
                  Tags: {s.tags}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}