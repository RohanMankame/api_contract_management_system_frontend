import { PageLayout } from '../components/PageLayout';
import '../styles/pages/DashboardPage.css';

export function ProductsPage() {
  return (
    <PageLayout>
      <div className="dashboard-container">
        <h2>Products</h2>
        <p>Manage your API products</p>
      </div>
    </PageLayout>
  );
}