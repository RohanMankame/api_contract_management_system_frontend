import { useEffect, useRef, useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { DataTable } from '../components/DataTable';
import { useApi } from '../hooks/useApi';
import { EntityModal } from '../components/EntityModal';
import { EditEntityModal } from '../components/EditEntityModal';
import '../styles/pages/ClientsPage.css';

export function ClientsPage() {
  const { data: response, isLoading, error, get, post, put, delete: deleteRequest } = useApi();
  const gridApiRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Fetch clients on component mount
  useEffect(() => {
    get('/clients');
  }, []);

  // Safely extract clients array
  const clients = (response && response.data && Array.isArray(response.data.clients)) 
    ? response.data.clients 
    : [];

    // ag-grid column definitions
  const columnDefs = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'company_name', headerName: 'Company', flex: 2 },
    { field: 'email', headerName: 'Email', flex: 2 },
    { field: 'phone_number', headerName: 'Phone', flex: 1.5 },
    { field: 'address', headerName: 'Address', flex: 2 },
    { field: 'created_at', headerName: 'Created', flex: 1 },
    { field: 'updated_at', headerName: 'Updated', flex: 1 },
  ];

  // input fields for add/edit modals
  const formFields = [
    { name: 'company_name', label: 'Company Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone_number', label: 'Phone Number', type: 'text', required: true },
    { name: 'address', label: 'Address', type: 'textarea', required: true },
  ];

  // ag-grid quick filter search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (gridApiRef.current) {
      gridApiRef.current.setGridOption('quickFilterText', value);
    }
  };

  // ag-grid onGridReady
  const handleGridReady = (params) => {
    gridApiRef.current = params.api;
  };

  // Handle row double click to open edit modal
  const handleRowDoubleClick = (event) => {
    setSelectedClient(event.data);
    setShowEditModal(true);
  };

  
  // Handle add client
  const handleAddClient = async (formData) => {
    await post('/clients', formData);  
    setShowAddModal(false);
    get('/clients');
};


// Handle edit client
const handleEditClient = async (formData) => {
  await put(`/clients/${selectedClient.id}`, formData); 
  setShowEditModal(false);
  get('/clients');
};


// Handle delete client
const handleDeleteClient = async (clientId) => {
  await deleteRequest(`/clients/${clientId}`);
  setShowEditModal(false);
  get('/clients');
};

  return (
    <PageLayout>
      <div className="clients-container">
        <div className="clients-header">
          <div className="clients-header-top">
            <div>
              <h2>Clients</h2>
              <p>Manage your API clients and integrations</p>
              <p>Double click a client to edit or delete it.</p>
            </div>
            <button onClick={() => setShowAddModal(true)} className="btn-add-client">
              + Add Client
            </button>
          </div>
          <div className="clients-search">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchText}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>
        <DataTable 
          onGridReady={handleGridReady}
          data={clients} 
          isLoading={isLoading} 
          error={error}
          columnDefs={columnDefs}
          paginationPageSize={10}
          onRowDoubleClick={handleRowDoubleClick}
          exportFileName="clients"
        />
        <EntityModal
          isOpen={showAddModal}
          title="Add Client"
          fields={formFields}
          onSubmit={handleAddClient}
          onClose={() => setShowAddModal(false)}
        />
        <EditEntityModal
          isOpen={showEditModal}
          title="Edit Client"
          fields={formFields}
          data={selectedClient}
          onSubmit={handleEditClient}
          onDelete={handleDeleteClient}
          onClose={() => setShowEditModal(false)}
        />
      </div>
    </PageLayout>
  );
}