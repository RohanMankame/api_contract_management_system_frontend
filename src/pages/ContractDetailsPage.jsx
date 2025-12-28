// src/pages/ContractDetailsPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { ContractInfoCard } from '../components/ContractInfoCard';
import { SubscriptionList } from '../components/SubscriptionList';
import { useApi } from '../hooks/useApi';
import '../styles/pages/ContractDetailsPage.css';
import '../styles/components/ContractInfoCard.css';
import '../styles/components/SubscriptionList.css';
import '../styles/components/SubscriptionItem.css';

export function ContractDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, error, get, put, delete: deleteRequest } = useApi();
  const [contract, setContract] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [expandedSubscriptions, setExpandedSubscriptions] = useState(new Set());
  const [clients, setClients] = useState([]);

  const extractContractData = (response) => {
    if (response && response.data && response.data.contract) {
      return response.data.contract;
    } else if (response && response.contract) {
      return response.contract;
    } else if (response) {
      return response;
    }
    return null;
  };

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
      const contractData = extractContractData(contractResponse);
      
      setContract(contractData);
      
      // Extract subscriptions if they exist in the contract
      if (contractData && contractData.subscriptions && Array.isArray(contractData.subscriptions)) {
        setSubscriptions(contractData.subscriptions);
      }
    } catch (err) {
      console.error('Error loading contract:', err);
    }
  };

  useEffect(() => {
    loadContractData();
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
      
      // Reload the contract data
      await loadContractData();
    } catch (err) {
      console.error('Error updating contract:', err);
    }
  };

  const handleDeleteContract = async () => {
    try {
      await deleteRequest(`/contracts/${id}`);
      // Redirect to contracts page after successful deletion
      navigate('/contracts');
    } catch (err) {
      console.error('Error deleting contract:', err);
    }
  };

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

        <ContractInfoCard 
          contract={contract}
          clients={clients}
          onEditSubmit={handleEditContract}
          onDelete={handleDeleteContract}
        />

        <SubscriptionList 
          subscriptions={subscriptions}
          expandedSubscriptions={expandedSubscriptions}
          onToggleExpand={toggleSubscriptionExpanded}
        />
      </div>
    </PageLayout>
  );
}