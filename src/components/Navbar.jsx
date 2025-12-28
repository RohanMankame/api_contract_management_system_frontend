import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/components/Navbar.css';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  return (
    <nav className="navbar">
      <button className="navbar-mobile-home-btn" onClick={handleHomeClick} title="Home">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      </button>
      <div className="navbar-brand">
        <h1>API Contract Manager</h1>
      </div>
      <div className="navbar-user">
        <span className="user-email">Logged in as {user?.email}</span>
        <button onClick={handleLogout} className="btn-signout">
          Sign Out
        </button>
      </div>
    </nav>
  );
}