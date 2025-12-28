import { PageLayout } from '../components/PageLayout';
import '../styles/pages/DashboardPage.css';

export function DashboardPage() {
  return (
    <PageLayout>
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <p>Welcome to API Contract Manager</p>
      </div>
    </PageLayout>
  );
}