import { useEffect, useRef, useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { DataTable } from '../components/DataTable';
import { useApi } from '../hooks/useApi';
import { EntityModal } from '../components/EntityModal';
import { EditEntityModal } from '../components/EditEntityModal';
import '../styles/pages/UserSettingsPage.css';

export function UserSettingsPage() {
  const { data: response, isLoading, error, get, post, put, delete: deleteRequest } = useApi();
  const gridApiRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    get('/users');
  }, []);

  const users = (response && response.data && Array.isArray(response.data.users))
    ? response.data.users
    : [];

  const columnDefs = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'full_name', headerName: 'Full Name', flex: 2 },
    { field: 'email', headerName: 'Email', flex: 2 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      headerName: 'Status',
      flex: 1.2,
      valueGetter: (params) => (params.data?.is_archived ? 'Archived' : 'Active')
    },
    { field: 'created_at', headerName: 'Created', flex: 1 },
    { field: 'updated_at', headerName: 'Updated', flex: 1 },
  ];

  const addFormFields = [
    { name: 'full_name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'employee', label: 'Employee' }
      ]
    },
  ];

  // For edit, password is optional
  const editFormFields = addFormFields.map(f => f.name === 'password' ? { ...f, required: false } : f);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (gridApiRef.current) {
      gridApiRef.current.setGridOption('quickFilterText', value);
    }
  };

  const handleGridReady = (params) => {
    gridApiRef.current = params.api;
  };

  const handleRowDoubleClick = (event) => {
    setSelectedUser(event.data);
    setShowEditModal(true);
  };

  const handleAddUser = async (formData) => {
    await post('/users', formData);
    setShowAddModal(false);
    get('/users');
  };

  const handleEditUser = async (formData) => {
    // Don't send empty password on edit
    if (!formData.password) {
      delete formData.password;
    }
    await put(`/users/${selectedUser.id}`, formData);
    setShowEditModal(false);
    get('/users');
  };

  const handleDeleteUser = async (userId) => {
    await deleteRequest(`/users/${userId}`);
    setShowEditModal(false);
    get('/users');
  };

  return (
    <PageLayout>
      <div className="users-container">
        <div className="users-header">
          <div className="users-header-top">
            <div>
              <h2>Users</h2>
              <p>Manage your application users and roles</p>
              <p>Double click a user to edit or delete it.</p>
            </div>
            <button onClick={() => setShowAddModal(true)} className="btn-add-user">
              + Add User
            </button>
          </div>
          <div className="users-search">
            <input
              type="text"
              placeholder="Search users..."
              value={searchText}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        <DataTable
          onGridReady={handleGridReady}
          data={users}
          isLoading={isLoading}
          error={error}
          columnDefs={columnDefs}
          paginationPageSize={10}
          onRowDoubleClick={handleRowDoubleClick}
        />

        <EntityModal
          isOpen={showAddModal}
          title="Add User"
          fields={addFormFields}
          onSubmit={handleAddUser}
          onClose={() => setShowAddModal(false)}
        />

        <EditEntityModal
          isOpen={showEditModal}
          title="Edit User"
          fields={editFormFields}
          data={selectedUser}
          onSubmit={handleEditUser}
          onDelete={handleDeleteUser}
          onClose={() => setShowEditModal(false)}
        />
      </div>
    </PageLayout>
  );
}