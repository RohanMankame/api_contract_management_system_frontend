import { useNavigate } from 'react-router-dom';
import '../styles/components/Sidebar.css';

export function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
        label: 'Products',
        path: '/products',
        icon: (
            <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="6" width="8" height="12" rx="1" />
            <rect x="13" y="6" width="8" height="12" rx="1" />
            <line x1="7" y1="3" x2="7" y2="6" />
            <line x1="17" y1="3" x2="17" y2="6" />
            <line x1="7" y1="18" x2="7" y2="21" />
            <line x1="17" y1="18" x2="17" y2="21" />
            </svg>
        ),
    },
    {
      label: 'Clients',
      path: '/clients',
      icon: (
        <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="8" r="4" />
          <path d="M 6 20 C 6 16.686 8.686 14 12 14 C 15.314 14 18 16.686 18 20" />
        </svg>
      ),
    },
    {
      label: 'Contracts',
      path: '/contracts',
      icon: (
        <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="16" y2="17" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="sidebar-item"
            title={item.label}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}