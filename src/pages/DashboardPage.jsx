import { Navbar } from '../components/Navbar';
import '../styles/pages/DashboardPage.css';

export function DashboardPage() {
  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-container">
        <h2>Dashboard</h2>
        <p>Welcome to API Contract Manager</p>
      </main>
    </div>
  );
}