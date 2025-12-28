import React from 'react';
import { EditEntityModal } from './EditEntityModal';
import '../styles/components/ContractInfoCard.css';

export function ContractInfoCard({ contract, clients, onEditSubmit, onDelete }) {
  const [showEditModal, setShowEditModal] = React.useState(false);

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

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const contractForModal = {
    ...contract,
    start_date: formatDateForInput(contract.start_date),
    end_date: formatDateForInput(contract.end_date)
  };

  const handleSubmit = async (formData) => {
    await onEditSubmit(formData);
    setShowEditModal(false);
  };

  return (
    <>
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

      <EditEntityModal
        isOpen={showEditModal}
        title="Edit Contract"
        fields={formFields}
        data={contractForModal}
        onSubmit={handleSubmit}
        onDelete={onDelete}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
}