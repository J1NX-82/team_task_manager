import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Folder } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  if (loading) return <div className="flex justify-center" style={{ marginTop: '3rem' }}>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Projects</h1>
          <p className="text-secondary">Manage your team projects</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} style={{ marginRight: '0.5rem' }} /> New Project
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {projects.map((project) => (
          <Link to={`/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ height: '100%' }}>
              <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)' }}>
                  <Folder size={24} color="var(--primary-color)" />
                </div>
                <div>
                  <h3 style={{ color: 'var(--text-primary)' }}>{project.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p className="text-secondary" style={{ fontSize: '0.875rem', flex: 1, marginBottom: '1.5rem' }}>
                {project.description || 'No description provided.'}
              </p>
              <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div className="flex gap-2 text-secondary" style={{ fontSize: '0.875rem' }}>
                  <span className="badge badge-medium">{project._count?.tasks || 0} Tasks</span>
                  <span className="badge badge-low">{project._count?.members || 0} Members</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="text-secondary" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            No projects found. {user?.role === 'ADMIN' ? 'Create one to get started!' : ''}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-surface" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="input-group">
                <label>Project Name</label>
                <input 
                  type="text" 
                  className="input" 
                  value={newProject.name} 
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea 
                  className="textarea" 
                  rows="3"
                  value={newProject.description} 
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})} 
                />
              </div>
              <div className="flex gap-4" style={{ marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
