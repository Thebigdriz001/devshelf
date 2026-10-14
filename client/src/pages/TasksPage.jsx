import { useState, useEffect } from 'react';
import api from '../api/client';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(''); // empty = all

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [project, setProject] = useState('');

  // 1. Fetch tasks with optional query filter
  const fetchTasks = async (statusFilter = '') => {
    try {
      setLoading(true);
      const url = statusFilter ? `/tasks?status=${statusFilter}` : '/tasks';
      const res = await api.get(url);
      setTasks(res.data);
    } catch (err) {
      alert('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(filterStatus);
  }, [filterStatus]);

  // 2. Create Task
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', {
        title,
        description,
        status: 'todo',
        priority,
        project,
      });
      setTasks([res.data, ...tasks]);
      setTitle('');
      setDescription('');
      setProject('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create task');
    }
  };

  // 3. Partial Update via PATCH: change status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.patch(`/tasks/${id}/status`, { status: newStatus });
      // Update the local task object in state
      setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  // 4. Delete Task
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1>Developer Tasks</h1>
          <p>Track your feature backlog, bugs, and learning roadmap.</p>
        </div>

        {/* Filter Dropdown */}
        <div>
          <label style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '0.4rem' }}>
            <option value="">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* Create Form */}
      <form onSubmit={handleCreate} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
        <h3>Create New Task</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem' }}>Title *</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Implement refresh token flow" style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem' }}>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem' }}>Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Details or acceptance criteria" style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem' }}>Project</label>
            <input value={project} onChange={(e) => setProject(e.target.value)} placeholder="e.g. DevShelf Frontend" style={{ width: '100%', padding: '0.5rem' }} />
          </div>
        </div>

        <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Task
        </button>
      </form>

      {/* List */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found for this filter.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: task.status === 'done' ? '#f8fafc' : '#fff',
                opacity: task.status === 'done' ? 0.75 : 1,
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    textDecoration: task.status === 'done' ? 'line-through' : 'none',
                  }}
                >
                  {task.title}
                </span>

                <span
                  style={{
                    marginLeft: '0.5rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    background: task.priority === 'high' ? '#fee2e2' : task.priority === 'low' ? '#f1f5f9' : '#fef3c7',
                    color: task.priority === 'high' ? '#991b1b' : task.priority === 'low' ? '#475569' : '#92400e',
                  }}
                >
                  {task.priority}
                </span>

                {task.project && (
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                    [{task.project}]
                  </span>
                )}

                {task.description && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>{task.description}</p>}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  style={{ padding: '0.3rem 0.6rem', borderRadius: '4px' }}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                <button onClick={() => handleDelete(task.id)} style={{ padding: '0.3rem 0.6rem', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}