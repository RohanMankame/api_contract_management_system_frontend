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

  return (
    <nav className="navbar">
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