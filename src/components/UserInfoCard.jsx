import { useMemo, useState, useEffect } from 'react';
import { EditEntityModal } from './EditEntityModal';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { API_ENDPOINTS } from '../config/api';
import '../styles/components/UserInfoCard.css';

export function UserInfoCard() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { put, get } = useApi();
  const { user, login } = useAuth();

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching current user data');
        
        const response = await get(API_ENDPOINTS.PROTECTED);
        console.log('User fetch response:', response);
        
        const userInfo = response?.data || response;
        setUserData(userInfo);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user information');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [get]);

  const formFields = useMemo(() => [
    { name: 'full_name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
  ], []);

  const handleEditSubmit = async (formData) => {
    const response = await put(`/users/${userData.id}`, formData);
    const updatedUser = response?.data?.user || response?.user || response;
    
    // Update local state
    setUserData(updatedUser);
    
    // Update auth context with new user data
    login(localStorage.getItem('authToken'), updatedUser);
  };

  if (loading) {
    return <div className="user-info-loading">Loading user information...</div>;
  }

  if (error) {
    return <div className="user-info-error">{error}</div>;
  }

  if (!userData) {
    return <div className="user-info-loading">Unable to load user information</div>;
  }

  return (
    <>
      <div className="user-info-section">
        <div className="user-info-header">
          <h2>User Information</h2>
          <button onClick={() => setShowEditModal(true)} className="btn-edit-user">
            Edit Profile
          </button>
        </div>
        <div className="user-info-card">
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              <p>{userData.full_name || 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{userData.email || 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>User ID</label>
              <p>{userData.id}</p>
            </div>
            <div className="info-item">
              <label>Status</label>
              <p>{userData.is_archived ? 'Archived' : 'Active'}</p>
            </div>
            {userData.created_at && (
              <div className="info-item">
                <label>Member Since</label>
                <p>{new Date(userData.created_at).toLocaleDateString()}</p>
              </div>
            )}
            {userData.updated_at && (
              <div className="info-item">
                <label>Last Updated</label>
                <p>{new Date(userData.updated_at).toLocaleDateString()}</p>
              </div>
            )}
            {userData.updated_at && (
              <div className="info-item">
                <label>Role</label>
                <p>{userData.role || 'N/A'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditEntityModal
        isOpen={showEditModal}
        title="Edit Profile"
        fields={formFields}
        data={userData}
        onSubmit={handleEditSubmit}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
}