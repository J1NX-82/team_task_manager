import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Users, Calendar, AlertCircle } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const { user } = useAuth();
  
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedToId: '' });
  const [newMemberId, setNewMemberId] = useState('');

  const fetchData = async () => {
    try {
      const [projRes, usersRes] = await Promise.all([
        axios.get(`/api/projects/${id}`),
        user.role === 'ADMIN' ? axios.get('/api/auth/users') : Promise.resolve({ data: [] })
      ]);
      setProject(projRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to fetch project details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', { ...newTask, projectId: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedToId: '' });
      fetchData();
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/projects/${id}/members`, { userId: newMemberId });
      setShowMemberModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to add member', err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (loading || !project) return <div className="flex justify-center" style={{ marginTop: '3rem' }}>Loading...</div>;

  const getTasksByStatus = (status) => project.tasks.filter(t => t.status === status);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'HIGH': return 'var(--priority-high)';
      case 'MEDIUM': return 'var(--priority-medium)';
      case 'LOW': return 'var(--priority-low)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>{project.name}</h1>
          <p className="text-secondary">{project.description}</p>
        </div>
        <div className="flex gap-4">
          {user?.role === 'ADMIN' && (
            <>
              <button className="btn btn-secondary" onClick={() => setShowMemberModal(true)}>
                <Users size={18} style={{ marginRight: '0.5rem' }} /> Add Member
              </button>
              <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
                <Plus size={18} style={{ marginRight: '0.5rem' }} /> New Task
              </button>
            </>
          )}
        </div>
      </div>

      <div className="kanban-board">
        {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
          <div key={status} className="kanban-column">
            <div className="kanban-header">
              <span>{status.replace('_', ' ')}</span>
              <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                {getTasksByStatus(status).length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3">
              {getTasksByStatus(status).map(task => (
                <div key={task.id} className="task-card">
                  <div className="flex justify-between items-start" style={{ marginBottom: '0.5rem' }}>
                    <div className={`badge badge-${task.priority.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                      {task.priority}
                    </div>
                    <select 
                      value={task.status} 
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}
                      disabled={user.role !== 'ADMIN' && task.assignedToId !== user.id}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                  <h4 className="task-title">{task.title}</h4>
                  {task.description && <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{task.description}</p>}
                  
                  <div className="task-meta">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </div>
                    <div className="flex items-center gap-1" title={task.assignedTo?.name || 'Unassigned'}>
                      <Users size={14} />
                      {task.assignedTo?.name?.split(' ')[0] || 'Unassigned'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content glass-surface" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label>Title</label>
                <input type="text" className="input" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea className="textarea" rows="3" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Priority</label>
                  <select className="select" value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Due Date</label>
                  <input type="date" className="input" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label>Assign To</label>
                <select className="select" value={newTask.assignedToId} onChange={(e) => setNewTask({...newTask, assignedToId: e.target.value})}>
                  <option value="">Unassigned</option>
                  {project.members.map(m => (
                    <option key={m.user.id} value={m.user.id}>{m.user.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4" style={{ marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
          <div className="modal-content glass-surface" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add Member to Project</h2>
            <form onSubmit={handleAddMember}>
              <div className="input-group">
                <label>Select User</label>
                <select className="select" value={newMemberId} onChange={(e) => setNewMemberId(e.target.value)} required>
                  <option value="">Select a user</option>
                  {users.filter(u => !project.members.find(m => m.user.id === u.id)).map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4" style={{ marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
