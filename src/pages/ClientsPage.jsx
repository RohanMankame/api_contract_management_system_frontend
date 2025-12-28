import { PageLayout } from '../components/PageLayout';
import '../styles/pages/DashboardPage.css';

export function ClientsPage() {
  return (
    <PageLayout>
      <div className="dashboard-container">
        <h2>Clients</h2>
        <p>Manage your API clients</p>
      </div>
    </PageLayout>
  );
}