import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="flex items-center gap-2" style={{ marginBottom: '2rem' }}>
          <div className="bg-blue-600 rounded-lg p-2" style={{ backgroundColor: 'var(--primary-color)', borderRadius: 'var(--radius-md)', padding: '0.5rem' }}>
            <FolderKanban size={24} color="white" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>TaskFlow</h2>
        </div>

        <nav className="flex flex-col gap-2" style={{ flex: 1 }}>
          <Link 
            to="/" 
            className={`btn btn-secondary ${location.pathname === '/' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', border: location.pathname === '/' ? '1px solid var(--primary-color)' : 'none' }}
          >
            <LayoutDashboard size={18} style={{ marginRight: '0.5rem' }} /> Dashboard
          </Link>
          <Link 
            to="/projects" 
            className={`btn btn-secondary ${location.pathname.startsWith('/projects') ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', border: location.pathname.startsWith('/projects') ? '1px solid var(--primary-color)' : 'none' }}
          >
            <FolderKanban size={18} style={{ marginRight: '0.5rem' }} /> Projects
          </Link>
        </nav>

        <div className="user-profile glass-surface" style={{ padding: '1rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="flex items-center gap-2">
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.role}</div>
            </div>
          </div>
          <button onClick={logout} className="btn" style={{ width: '100%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}>
            <LogOut size={16} style={{ marginRight: '0.5rem' }} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
