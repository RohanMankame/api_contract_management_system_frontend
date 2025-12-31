import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { DataTable } from '../components/DataTable';
import { useApi } from '../hooks/useApi';
import { EntityModal } from '../components/EntityModal';
import { ContractActionModal } from '../components/ContractActionModal';
import '../styles/pages/ContractsPage.css';

export function ContractsPage() {
  const { data: response, isLoading, error, get, post, delete: deleteRequest } = useApi();
  const navigate = useNavigate();
  const gridApiRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [clients, setClients] = useState([]);

 
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch clients first
        const clientsResponse = await get('/clients');
        console.log('Clients Response:', clientsResponse);
        
        // Check different possible response structures
        let clientsData = [];
        if (clientsResponse && clientsResponse.data && Array.isArray(clientsResponse.data.clients)) {
          clientsData = clientsResponse.data.clients;
        } else if (clientsResponse && Array.isArray(clientsResponse.clients)) {
          clientsData = clientsResponse.clients;
        } else if (Array.isArray(clientsResponse)) {
          clientsData = clientsResponse;
        }
        
        console.log('Extracted clients:', clientsData);
        setClients(clientsData);
        
        // Fetch contracts
        await get('/contracts');
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    
    loadData();
  }, []);

  const contracts = (response && response.data && response.data.contracts && Array.isArray(response.data.contracts)) 
    ? response.data.contracts 
    : [];

  const columnDefs = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'contract_name', headerName: 'Contract Name', flex: 2 },
    { field: 'client_id', headerName: 'Client ID', flex: 1 },
    { field: 'start_date', headerName: 'Start Date', flex: 1.2 },
    { field: 'end_date', headerName: 'End Date', flex: 1.2 },
    { field: 'created_at', headerName: 'Created', flex: 1 },
    { field: 'updated_at', headerName: 'Updated', flex: 1 },
  ];

  // use clients data
  const formFields = [
    { 
      name: 'client_id', 
      label: 'Client', 
      type: 'select',
      options: clients.map(c => ({ value: c.id, label: c.company_name })),
      required: true 
    },
    { name: 'contract_name', label: 'Contract Name', type: 'text', required: true },
    { name: 'start_date', label: 'Start Date', type: 'date', required: true },
    { name: 'end_date', label: 'End Date', type: 'date', required: true },
  ];

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
    setSelectedContract(event.data);
    setShowActionModal(true);
  };

  const handleAddContract = async (formData) => {
    try {
      // Validate client_id is not empty
      if (!formData.client_id || formData.client_id === '') {
        console.error('client_id is required and cannot be empty');
        alert('Please select a client');
        return;
      }

      const dataToSubmit = {
        client_id: formData.client_id,
        contract_name: formData.contract_name,
        start_date: formData.start_date,
        end_date: formData.end_date
      };
      
      console.log('Submitting contract:', dataToSubmit);
      await post('/contracts', dataToSubmit);
      setShowAddModal(false);
      get('/contracts');
    } catch (err) {
      console.error('Error adding contract:', err);
    }
  };

  const handleEditContract = () => {
    setShowActionModal(false);
    navigate(`/contracts/${selectedContract.id}`);
  };

  const handleDeleteContract = async () => {
    try {
      await deleteRequest(`/contracts/${selectedContract.id}`);
      setShowActionModal(false);
      setSelectedContract(null);
      get('/contracts');
    } catch (err) {
      console.error('Error deleting contract:', err);
    }
  };

  const handleCloseActionModal = () => {
    setShowActionModal(false);
    setSelectedContract(null);
  };

  return (
    <PageLayout>
      <div className="contracts-container">
        <div className="contracts-header">
          <div className="contracts-header-top">
            <div>
              <h2>Contracts</h2>
              <p>Manage your API contracts and agreements</p>
              <p>Double click a contract to edit or delete it.</p>
            </div>
            <button onClick={() => setShowAddModal(true)} className="btn-add-contract">
              + Add Contract
            </button>
          </div>
          <div className="contracts-search">
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchText}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>
        <DataTable 
          onGridReady={handleGridReady}
          data={contracts} 
          isLoading={isLoading} 
          error={error}
          columnDefs={columnDefs}
          paginationPageSize={10}
          onRowDoubleClick={handleRowDoubleClick}
        />
        <EntityModal
          isOpen={showAddModal}
          title="Add Contract"
          fields={formFields}
          onSubmit={handleAddContract}
          onClose={() => setShowAddModal(false)}
        />
        <ContractActionModal
          isOpen={showActionModal}
          contract={selectedContract}
          onEdit={handleEditContract}
          onDelete={handleDeleteContract}
          onClose={handleCloseActionModal}
        />
      </div>
    </PageLayout>
  );
}