import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Clock, ListTodo, Users } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center" style={{ marginTop: '3rem' }}>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Dashboard</h1>
          <p className="text-secondary">Welcome back, {user?.name}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="stat-card">
          <div className="flex justify-between items-center">
            <h3 className="text-secondary" style={{ fontSize: '1rem' }}>Total Tasks</h3>
            <ListTodo size={20} color="var(--primary-color)" />
          </div>
          <div className="stat-value">{stats?.totalTasks || 0}</div>
        </div>
        
        <div className="stat-card">
          <div className="flex justify-between items-center">
            <h3 className="text-secondary" style={{ fontSize: '1rem' }}>To Do</h3>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--status-todo)' }}></div>
          </div>
          <div className="stat-value">{stats?.tasksByStatus?.TODO || 0}</div>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-center">
            <h3 className="text-secondary" style={{ fontSize: '1rem' }}>In Progress</h3>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--status-inprogress)' }}></div>
          </div>
          <div className="stat-value">{stats?.tasksByStatus?.IN_PROGRESS || 0}</div>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-center">
            <h3 className="text-secondary" style={{ fontSize: '1rem' }}>Done</h3>
            <CheckCircle2 size={20} color="var(--status-done)" />
          </div>
          <div className="stat-value">{stats?.tasksByStatus?.DONE || 0}</div>
        </div>

        <div className="stat-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <div className="flex justify-between items-center">
            <h3 className="text-secondary" style={{ fontSize: '1rem' }}>Overdue Tasks</h3>
            <Clock size={20} color="#ef4444" />
          </div>
          <div className="stat-value" style={{ background: 'linear-gradient(to right, #f87171, #ef4444)', WebkitBackgroundClip: 'text' }}>
            {stats?.overdueTasks || 0}
          </div>
        </div>
      </div>

      {user?.role === 'ADMIN' && stats?.tasksPerUser && stats.tasksPerUser.length > 0 && (
        <div className="glass-surface" style={{ padding: '1.5rem' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
            <Users size={20} color="var(--primary-color)" />
            <h2>Tasks by User</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {stats.tasksPerUser.map((userStat, i) => (
              <div key={i} className="flex justify-between items-center" style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 500 }}>{userStat.user}</span>
                <span className="badge badge-medium">{userStat.count} tasks</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
