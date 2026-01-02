import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardIcon, ProductsIcon, ClientsIcon, ContractsIcon, SettingsIcon } from './Icons';
import '../styles/components/Sidebar.css';

export function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
    },
    {
      label: 'Products',
      path: '/products',
      icon: <ProductsIcon />,
    },
    {
      label: 'Clients',
      path: '/clients',
      icon: <ClientsIcon />,
    },
    {
      label: 'Contracts',
      path: '/contracts',
      icon: <ContractsIcon />,
    },
  ];

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <aside 
      className={`sidebar ${isOpen ? 'open' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="sidebar-item"
            title={item.label}
          >
            <div className="sidebar-icon">{item.icon}</div>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      
      <div className="sidebar-footer">
        <button
          onClick={() => navigate('/settings')}
          className="sidebar-item settings-item"
          title="Settings"
        >
          <div className="sidebar-icon"><SettingsIcon /></div>
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}