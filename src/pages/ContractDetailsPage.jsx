import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { useApi } from '../hooks/useApi';
import { ContractInfoCard } from '../components/ContractInfoCard';
import { SubscriptionList } from '../components/SubscriptionList';
import '../styles/pages/ContractDetailsPage.css';

export function ContractDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, error, get } = useApi();
  const [contract, setContract] = useState(null);
  const [clients, setClients] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [expandedSubscriptions, setExpandedSubscriptions] = useState(new Set());

  // Fetch contract details, clients, subscriptions and products on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch products first (needed for subscriptions)
        const productsResponse = await get('/products');
        let productsData = [];
        if (productsResponse && productsResponse.data && Array.isArray(productsResponse.data.products)) {
          productsData = productsResponse.data.products;
        } else if (productsResponse && Array.isArray(productsResponse.products)) {
          productsData = productsResponse.products;
        } else if (Array.isArray(productsResponse)) {
          productsData = productsResponse;
        }
        setProducts(productsData);
        console.log('Loaded products:', productsData);

        // Fetch the specific contract
        const contractResponse = await get(`/contracts/${id}`);
        const contractData = contractResponse?.data?.contract || contractResponse?.contract || contractResponse;
        setContract(contractData);

        // Fetch clients for any edit operations
        const clientsResponse = await get('/clients');
        let clientsData = [];
        if (clientsResponse && clientsResponse.data && Array.isArray(clientsResponse.data.clients)) {
          clientsData = clientsResponse.data.clients;
        } else if (clientsResponse && Array.isArray(clientsResponse.clients)) {
          clientsData = clientsResponse.clients;
        } else if (Array.isArray(clientsResponse)) {
          clientsData = clientsResponse;
        }
        setClients(clientsData);

        // Fetch subscriptions for the contract
        const subscriptionsResponse = await get(`/contracts/${id}/subscriptions`);
        let subscriptionsData = [];
        if (subscriptionsResponse && subscriptionsResponse.data && Array.isArray(subscriptionsResponse.data.subscriptions)) {
          subscriptionsData = subscriptionsResponse.data.subscriptions;
        } else if (subscriptionsResponse && Array.isArray(subscriptionsResponse.subscriptions)) {
          subscriptionsData = subscriptionsResponse.subscriptions;
        } else if (Array.isArray(subscriptionsResponse)) {
          subscriptionsData = subscriptionsResponse;
        }
        setSubscriptions(subscriptionsData);
      } catch (err) {
        console.error('Error loading contract details:', err);
      }
    };

    loadData();
  }, [id, get]);

  const handleBackToContracts = () => {
    navigate('/contracts');
  };

  const handleContractUpdate = (updatedContract) => {
    setContract(updatedContract);
  };

  const handleDeleteContract = () => {
    navigate('/contracts');
  };

  const handleToggleSubscriptionExpand = (subscriptionId) => {
    const newExpanded = new Set(expandedSubscriptions);
    if (newExpanded.has(subscriptionId)) {
      newExpanded.delete(subscriptionId);
    } else {
      newExpanded.add(subscriptionId);
    }
    setExpandedSubscriptions(newExpanded);
  };

  const handleSubscriptionsUpdate = async () => {
    try {
      const subscriptionsResponse = await get(`/contracts/${id}/subscriptions`);
      let subscriptionsData = [];
      if (subscriptionsResponse && subscriptionsResponse.data && Array.isArray(subscriptionsResponse.data.subscriptions)) {
        subscriptionsData = subscriptionsResponse.data.subscriptions;
      } else if (subscriptionsResponse && Array.isArray(subscriptionsResponse.subscriptions)) {
        subscriptionsData = subscriptionsResponse.subscriptions;
      } else if (Array.isArray(subscriptionsResponse)) {
        subscriptionsData = subscriptionsResponse;
      }
      setSubscriptions(subscriptionsData);
    } catch (err) {
      console.error('Error updating subscriptions:', err);
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
          <p>Error loading contract</p>
          <button onClick={handleBackToContracts} className="btn-back">
            Back to Contracts
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="contract-details-container">
        <div className="contract-details-header">
          <button onClick={handleBackToContracts} className="btn-back">
            ← Back to Contracts
          </button>
          <h1>{contract.contract_name}</h1>
        </div>

        <div className="contract-details-content">
          <ContractInfoCard 
            contract={contract} 
            clients={clients} 
            onContractUpdate={handleContractUpdate}
            onDelete={handleDeleteContract}
          />
          
          {products.length > 0 && (
            <SubscriptionList
              subscriptions={subscriptions}
              expandedSubscriptions={expandedSubscriptions}
              onToggleExpand={handleToggleSubscriptionExpand}
              products={products}
              contractId={id}
              onSubscriptionsUpdate={handleSubscriptionsUpdate}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}