import { PageLayout } from '../components/PageLayout';
import '../styles/pages/DashboardPage.css';

export function ContractsPage() {
  return (
    <PageLayout>
      <div className="dashboard-container">
        <h2>Contracts</h2>
        <p>Manage your API contracts</p>
      </div>
    </PageLayout>
  );
}