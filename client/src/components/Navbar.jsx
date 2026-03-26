import React from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, History, Settings as SettingsIcon, Home as HomeIcon, LogOut, Video, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems = user ? [
    { id: 'home', label: 'Home', icon: HomeIcon, path: '/' },
    { id: 'live', label: 'Live Session', icon: Layout, path: '/live' },
    { id: 'video', label: 'Video Call', icon: Video, path: '/video' },
    { id: 'history', label: 'History', icon: History, path: '/history' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/settings' },
  ] : [
    { id: 'home', label: 'Home', icon: HomeIcon, path: '/' },
  ];

  return (
    <nav className="navbar-wrapper slide-up">
      <div className="container nav-container glass">
        <div className="nav-left">
          <Link to="/" className="logo" onClick={handleHomeClick}>
            <div className="logo-icon-box">
              <Video className="video-icon" size={24} />
            </div>
            <span className="logo-text">Insightly AI</span>
          </Link>
        </div>

        <div className="nav-center">
          <div className="nav-links">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={item.id === 'home' ? handleHomeClick : undefined}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="nav-right">
          {user ? (
            <div className="user-section">
              <div className="user-badge">
                <img src={`https://ui-avatars.com/api/?name=${user?.username}&background=6366f1&color=fff`} alt="User" />
                <div className="user-details">
                  <span className="name">{user?.username}</span>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout} title="Sign Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="auth-actions">
              <Link to="/login" className="nav-link">
                <LogIn size={18} />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="nav-link active">
                <UserPlus size={18} />
                <span>Join Free</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mobile-top-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            onClick={item.id === 'home' ? handleHomeClick : undefined}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 1.5rem 0 0.5rem 0;
          transition: all 0.3s ease;
        }
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.5rem;
          border-radius: 2rem;
          box-shadow: var(--shadow-lg);
        }
        .nav-left { flex: 1; }
        .nav-center { flex: 2; display: flex; justify-content: center; }
        .nav-right { flex: 1; display: flex; justify-content: flex-end; }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          text-decoration: none;
        }
        .logo-icon-box {
          width: 40px;
          height: 40px;
          background: var(--grad-main);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-glow);
        }
        .video-icon { color: white; }
        .logo-text {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.01em;
        }

        .nav-links {
          display: flex;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.03);
          padding: 0.4rem;
          border-radius: 1.5rem;
          border: 1px solid var(--surface-border);
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.25rem;
          border-radius: 1.1rem;
          text-decoration: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .nav-link:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-link.active {
          color: white;
          background: var(--grad-main);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .auth-actions {
            display: flex;
            gap: 1rem;
        }
        .user-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.4rem 0.8rem 0.4rem 0.4rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 2rem;
          border: 1px solid var(--surface-border);
        }
        .user-badge img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid var(--primary);
        }
        .user-details .name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .logout-btn {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid var(--surface-border);
          background: transparent;
          color: var(--text-muted);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          border-color: var(--danger);
          transform: rotate(15deg);
        }

        /* Mobile Top Nav */
        .mobile-top-nav {
          display: none;
          width: 95%;
          max-width: 500px;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          padding: 0.4rem;
          justify-content: space-around;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          margin: 1rem auto 0 auto;
        }

        .mobile-nav-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          color: var(--text-muted);
          text-decoration: none;
          padding: 0.5rem 0.25rem;
          border-radius: 1rem;
          transition: all 0.3s ease;
          flex: 1;
        }

        .mobile-nav-link span {
          font-size: 0.6rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .mobile-nav-link.active {
          color: white;
          background: var(--grad-main);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        @media (max-width: 1024px) {
          .nav-links span { display: none; }
          .nav-link { padding: 0.6rem 0.8rem; }
        }
        @media (max-width: 768px) {
          .nav-center { display: none; }
          .mobile-top-nav { display: flex; }
          .navbar-wrapper { padding: 0.75rem 0 0.5rem 0; }
          .nav-container { padding: 0.5rem 1rem; }
          .logo-text { font-size: 1.1rem; }
          .user-badge { padding: 0.3rem; }
          .user-details { display: none; }
        }
        @media (max-width: 480px) {
           .auth-actions span { display: none; }
           .auth-actions .nav-link { padding: 0.5rem; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
