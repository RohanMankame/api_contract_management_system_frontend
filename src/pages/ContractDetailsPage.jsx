import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { useApi } from '../hooks/useApi';
import { ContractInfoCard } from '../components/ContractInfoCard';
import '../styles/pages/ContractDetailsPage.css';

export function ContractDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, error, get } = useApi();
  const [contract, setContract] = useState(null);
  const [clients, setClients] = useState([]);

  // Fetch contract details and clients on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
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
          {/* Subscription components will go here later */}
        </div>
      </div>
    </PageLayout>
  );
}