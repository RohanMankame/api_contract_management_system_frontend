import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { ProductsIcon, ClientsIcon, ContractsIcon, ArrowIcon } from '../components/Icons';
import '../styles/pages/DashboardPage.css';

export function DashboardPage() {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Products',
      description: 'Manage your API products and versions',
      path: '/products',
      icon: <ProductsIcon />,
    },
    {
      title: 'Clients',
      description: 'Manage your API clients and integrations',
      path: '/clients',
      icon: <ClientsIcon />,
    },
    {
      title: 'Contracts',
      description: 'Manage your API contracts and agreements',
      path: '/contracts',
      icon: <ContractsIcon />,
    },
  ];

  return (
    <PageLayout>
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <p>Welcome to API Contract Manager</p>

        <div className="dashboard-grid">
          {sections.map((section) => (
            <button
              key={section.path}
              className="dashboard-card"
              onClick={() => navigate(section.path)}
            >
              <div className="dashboard-card-icon">
                {section.icon}
              </div>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
              <ArrowIcon />
            </button>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}