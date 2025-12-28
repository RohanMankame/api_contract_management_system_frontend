// src/pages/ContractDetailsPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { EditEntityModal } from '../components/EditEntityModal';
import { useApi } from '../hooks/useApi';
import '../styles/pages/ContractDetailsPage.css';

export function ContractDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, error, get, put } = useApi();
  const [contract, setContract] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [expandedSubscriptions, setExpandedSubscriptions] = useState(new Set());
  const [showEditModal, setShowEditModal] = useState(false);
  const [clients, setClients] = useState([]);

  // Helper function to format date for HTML date input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const loadContractData = async () => {
      try {
        // Fetch clients for dropdown
        const clientsResponse = await get('/clients');
        let clientsData = [];
        if (clientsResponse && clientsResponse.data && Array.isArray(clientsResponse.data.clients)) {
          clientsData = clientsResponse.data.clients;
        }
        setClients(clientsData);

        // Fetch contract details
        const contractResponse = await get(`/contracts/${id}`);
        console.log('Contract Response:', contractResponse);
        
        // Extract contract data
        let contractData = null;
        if (contractResponse && contractResponse.data && contractResponse.data.contract) {
          contractData = contractResponse.data.contract;
        } else if (contractResponse && contractResponse.contract) {
          contractData = contractResponse.contract;
        } else if (contractResponse) {
          contractData = contractResponse;
        }
        
        setContract(contractData);
        
        // Extract subscriptions if they exist in the contract
        if (contractData && contractData.subscriptions && Array.isArray(contractData.subscriptions)) {
          setSubscriptions(contractData.subscriptions);
        }
      } catch (err) {
        console.error('Error loading contract:', err);
      }
    };

    if (id) {
      loadContractData();
    }
  }, [id]);

  const toggleSubscriptionExpanded = (subscriptionId) => {
    setExpandedSubscriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subscriptionId)) {
        newSet.delete(subscriptionId);
      } else {
        newSet.add(subscriptionId);
      }
      return newSet;
    });
  };

  const handleEditContract = async (formData) => {
    try {
      const dataToSubmit = {
        client_id: formData.client_id,
        contract_name: formData.contract_name,
        start_date: formData.start_date,
        end_date: formData.end_date
      };

      await put(`/contracts/${id}`, dataToSubmit);
      setShowEditModal(false);
      
      // Reload the contract data
      const contractResponse = await get(`/contracts/${id}`);
      let contractData = null;
      if (contractResponse && contractResponse.data && contractResponse.data.contract) {
        contractData = contractResponse.data.contract;
      } else if (contractResponse && contractResponse.contract) {
        contractData = contractResponse.contract;
      } else if (contractResponse) {
        contractData = contractResponse;
      }
      
      setContract(contractData);
      if (contractData && contractData.subscriptions && Array.isArray(contractData.subscriptions)) {
        setSubscriptions(contractData.subscriptions);
      }
    } catch (err) {
      console.error('Error updating contract:', err);
    }
  };

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

  // Create a contract object with formatted dates for the modal
  const contractForModal = contract ? {
    ...contract,
    start_date: formatDateForInput(contract.start_date),
    end_date: formatDateForInput(contract.end_date)
  } : null;

  if (isLoading) {
    return (
      <PageLayout>
        <div className="contract-details-container">
          <p>Loading contract details...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !contract) {
    return (
      <PageLayout>
        <div className="contract-details-container">
          <p className="error-message">Error loading contract or contract not found</p>
          <button onClick={() => navigate('/contracts')} className="btn-back">
            Back to Contracts
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="contract-details-container">
        <button onClick={() => navigate('/contracts')} className="btn-back">
          ← Back to Contracts
        </button>
        <h1 className="page-title">{contract.contract_name}</h1>

        <div className="contract-info-section">
          <div className="contract-info-header">
            <h2>Contract Information</h2>
            <button onClick={() => setShowEditModal(true)} className="btn-edit-contract">
              Edit Contract
            </button>
          </div>
          <div className="contract-info-card">
            <div className="info-grid">
              <div className="info-item">
                <label>Contract Name</label>
                <p>{contract.contract_name}</p>
              </div>
              <div className="info-item">
                <label>Contract ID</label>
                <p>{contract.id}</p>
              </div>
              <div className="info-item">
                <label>Client ID</label>
                <p>{contract.client_id}</p>
              </div>
              <div className="info-item">
                <label>Start Date</label>
                <p>{new Date(contract.start_date).toLocaleDateString()}</p>
              </div>
              <div className="info-item">
                <label>End Date</label>
                <p>{new Date(contract.end_date).toLocaleDateString()}</p>
              </div>
              <div className="info-item">
                <label>Created</label>
                <p>{new Date(contract.created_at).toLocaleDateString()}</p>
              </div>
              <div className="info-item">
                <label>Updated</label>
                <p>{new Date(contract.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="subscriptions-section">
          <div className="subscriptions-header">
            <h2>Subscriptions ({subscriptions.length})</h2>
            <button className="btn-add-subscription">+ Add Subscription</button>
          </div>

          <div className="subscriptions-list">
            {subscriptions.length > 0 ? (
              subscriptions.map(subscription => (
                <div key={subscription.id} className="subscription-container">
                  <div 
                    className="subscription-header"
                    onClick={() => toggleSubscriptionExpanded(subscription.id)}
                  >
                    <div className="subscription-title-section">
                      <span className={`expand-icon ${expandedSubscriptions.has(subscription.id) ? 'expanded' : ''}`}>
                        ▼
                      </span>
                      <h3>Subscription {subscription.id.slice(0, 8)}...</h3>
                      <span className="subscription-meta">Product: {subscription.product_id}</span>
                    </div>
                    <span className="subscription-pricing">
                      {subscription.pricing_type}
                    </span>
                  </div>

                  {expandedSubscriptions.has(subscription.id) && (
                    <div className="subscription-content">
                      <div className="subscription-details">
                        <div className="detail-row">
                          <span className="label">ID:</span>
                          <span className="value">{subscription.id}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Product ID:</span>
                          <span className="value">{subscription.product_id}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Pricing Type:</span>
                          <span className="value">{subscription.pricing_type}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Strategy:</span>
                          <span className="value">{subscription.strategy}</span>
                        </div>
                      </div>

                      <div className="subscription-actions">
                        <button className="btn-edit-subscription">Edit</button>
                        <button className="btn-delete-subscription">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-subscriptions">
                <p>No subscriptions yet.</p>
              </div>
            )}
          </div>
        </div>

        <EditEntityModal
          isOpen={showEditModal}
          title="Edit Contract"
          fields={formFields}
          data={contractForModal}
          onSubmit={handleEditContract}
          onClose={() => setShowEditModal(false)}
        />
      </div>
    </PageLayout>
  );
}