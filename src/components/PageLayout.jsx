import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import '../styles/components/PageLayout.css';

export function PageLayout({ children }) {
  return (
    <div className="page-layout">
      <Navbar />
      <div className="page-content">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}