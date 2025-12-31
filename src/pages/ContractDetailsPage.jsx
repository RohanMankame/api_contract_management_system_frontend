/* import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { ContractInfoCard } from '../components/ContractInfoCard';
import { SubscriptionList } from '../components/SubscriptionList';
import { useApi } from '../hooks/useApi';
import '../styles/pages/ContractDetailsPage.css';
import '../styles/components/ContractInfoCard.css';
import '../styles/components/SubscriptionList.css';
import '../styles/components/SubscriptionItem.css';
import '../styles/components/SubscriptionTierItem.css';
import '../styles/components/SubscriptionTierList.css';

export function ContractDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, error, get, put, post, delete: deleteRequest } = useApi();
  const [contract, setContract] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [expandedSubscriptions, setExpandedSubscriptions] = useState(new Set());
  const [expandedTiers, setExpandedTiers] = useState(new Set());
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

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

  const extractProductsData = (response) => {
    if (response && response.data && Array.isArray(response.data.products)) {
      return response.data.products;
    } else if (response && Array.isArray(response.products)) {
      return response.products;
    } else if (Array.isArray(response)) {
      return response;
    }
    return [];
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

      // Fetch products for subscription dropdown
      const productsResponse = await get('/products');
      const productsData = extractProductsData(productsResponse);
      setProducts(productsData);

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

  const toggleTierExpanded = (tierId) => {
    setExpandedTiers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tierId)) {
        newSet.delete(tierId);
      } else {
        newSet.add(tierId);
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

  const handleAddSubscription = async (formData) => {
    try {
      const dataToSubmit = {
        contract_id: id,
        product_id: formData.product_id,
        pricing_type: formData.pricing_type,
        strategy: formData.strategy
      };

      await post('/subscriptions', dataToSubmit);
      
      // Reload the contract data to get updated subscriptions
      await loadContractData();
    } catch (err) {
      console.error('Error adding subscription:', err);
    }
  };

  const handleEditSubscription = async (subscriptionId, formData) => {
    try {
      const dataToSubmit = {
        product_id: formData.product_id,
        pricing_type: formData.pricing_type,
        strategy: formData.strategy
      };

      await put(`/subscriptions/${subscriptionId}`, dataToSubmit);
      
      // Reload the contract data to get updated subscriptions
      await loadContractData();
    } catch (err) {
      console.error('Error updating subscription:', err);
    }
  };

  const handleDeleteSubscription = async (subscriptionId) => {
    try {
      await deleteRequest(`/subscriptions/${subscriptionId}`);
      
      // Reload the contract data to get updated subscriptions
      await loadContractData();
    } catch (err) {
      console.error('Error deleting subscription:', err);
    }
  };

  const handleAddTier = async (subscriptionId, formData) => {
    try {
      // Convert date strings (YYYY-MM-DD) to ISO format with time
      const startDate = formData.start_date 
        ? new Date(formData.start_date + 'T00:00:00.000Z').toISOString()
        : null;
      const endDate = formData.end_date 
        ? new Date(formData.end_date + 'T00:00:00.000Z').toISOString()
        : null;

      const dataToSubmit = {
        subscription_id: subscriptionId,
        min_calls: parseInt(formData.min_calls, 10),
        max_calls: parseInt(formData.max_calls, 10),
        base_price: parseFloat(formData.base_price),
        price_per_tier: formData.price_per_tier ? parseFloat(formData.price_per_tier) : null,
        start_date: startDate,
        end_date: endDate || null
      };

      await post('/subscription-tiers', dataToSubmit);
      
      // Reload the contract data to get updated tiers
      await loadContractData();
    } catch (err) {
      console.error('Error adding tier:', err);
      throw err;
    }
  };

  const handleEditTier = async (tierId, formData) => {
    try {
      // Convert date strings (YYYY-MM-DD) to ISO format with time
      const startDate = formData.start_date 
        ? new Date(formData.start_date + 'T00:00:00.000Z').toISOString()
        : null;
      const endDate = formData.end_date 
        ? new Date(formData.end_date + 'T00:00:00.000Z').toISOString()
        : null;

      const dataToSubmit = {
        min_calls: parseInt(formData.min_calls, 10),
        max_calls: parseInt(formData.max_calls, 10),
        base_price: parseFloat(formData.base_price),
        price_per_tier: formData.price_per_tier ? parseFloat(formData.price_per_tier) : null,
        start_date: startDate,
        end_date: endDate || null
      };

      await put(`/subscription-tiers/${tierId}`, dataToSubmit);
      
      // Reload the contract data to get updated tiers
      await loadContractData();
    } catch (err) {
      console.error('Error updating tier:', err);
      throw err;
    }
  };

  const handleDeleteTier = async (tierId) => {
    try {
      await deleteRequest(`/subscription-tiers/${tierId}`);
      
      // Reload the contract data to get updated tiers
      await loadContractData();
    } catch (err) {
      console.error('Error deleting tier:', err);
      throw err;
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
          products={products}
          onAddSubscription={handleAddSubscription}
          onEditSubscription={handleEditSubscription}
          onDeleteSubscription={handleDeleteSubscription}
          expandedTiers={expandedTiers}
          onToggleTierExpand={toggleTierExpanded}
          onAddTier={handleAddTier}
          onEditTier={handleEditTier}
          onDeleteTier={handleDeleteTier}
        />
      </div>
    </PageLayout>
  );
} */