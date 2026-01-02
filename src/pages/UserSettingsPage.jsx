import { PageLayout } from '../components/PageLayout';
import { UserInfoCard } from '../components/UserInfoCard';
import '../styles/pages/UserSettingsPage.css';

export function UserSettingsPage() {
  return (
    <PageLayout>
      <div className="user-settings-container">
        <h1>Settings</h1>
        <p>Manage your account settings and personal information</p>
        <UserInfoCard />
      </div>
    </PageLayout>
  );
}