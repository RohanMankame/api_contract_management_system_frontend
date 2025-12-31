import { useState, useEffect } from 'react';
import '../styles/components/ContractActionModal.css';

export function ContractActionModal({ isOpen, contract, onEdit, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      // Reset any state if needed
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Contract Actions</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="action-modal-body">
          <div className="contract-info">
            <h3>{contract?.contract_name}</h3>
            <p className="contract-id">ID: {contract?.id}</p>
          </div>
          
          <div className="action-buttons">
            <button onClick={onEdit} className="btn-action btn-edit">
              View/Edit Contract
            </button>
          </div>

          <button onClick={onClose} className="btn-close-modal">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}