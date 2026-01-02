// src/pages/ContractDetailsPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { ContractInfoCard } from '../components/ContractInfoCard';
import { SubscriptionList } from '../components/SubscriptionList';
import { useContractDetails } from '../hooks/useContractDetails';
import '../styles/pages/ContractDetailsPage.css';

export function ContractDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    contract,
    clients,
    subscriptions,
    products,
    isLoading,
    error,
    refresh,
    setContract,
  } = useContractDetails(id);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="contract-details-container">
          <p>Loading contract details...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="contract-details-container">
          <p className="error-message"><strong>Error loading contract:</strong> {error}</p>
          <button onClick={() => navigate('/contracts')} className="btn-back">
            Back to Contracts
          </button>
        </div>
      </PageLayout>
    );
  }

  if (!contract) {
    return (
      <PageLayout>
        <div className="contract-details-container">
          <p>No contract data available.</p>
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
        <div className="contract-details-header">
          <button onClick={() => navigate('/contracts')} className="btn-back">
            ← Back to Contracts
          </button>
          <h1>{contract.contract_name}</h1>
        </div>

        <div className="contract-details-content">
          <ContractInfoCard
            contract={contract}
            clients={clients}
            onContractUpdate={setContract}
            onDelete={() => navigate('/contracts')}
          />
          {products.length > 0 && (
            <SubscriptionList
              subscriptions={subscriptions}
              products={products}
              contractId={id}
              onSubscriptionsUpdate={refresh}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}