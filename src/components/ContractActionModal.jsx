import { useState, useEffect } from 'react';
import '../styles/components/ContractActionModal.css';

export function ContractActionModal({ isOpen, contract, onEdit, onDelete, onClose }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset delete state
  useEffect(() => {
    if (!isOpen) {
      setShowDeleteConfirm(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Contract Actions</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {showDeleteConfirm ? (
          <div className="modal-delete-confirm">
            <p>Are you sure you want to delete this contract? This action cannot be undone.</p>
            <div className="modal-footer">
              <button 
                type="button" 
                onClick={() => setShowDeleteConfirm(false)} 
                className="btn-cancel"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="btn-delete"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ) : (
          <div className="action-modal-body">
            <div className="contract-info">
              <h3>{contract?.contract_name}</h3>
              <p className="contract-id">ID: {contract?.id}</p>
            </div>
            
            <div className="action-buttons">
              <button onClick={onEdit} className="btn-action btn-edit">
                View/Edit Contract
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="btn-action btn-delete-action"
              >
                Delete Contract
              </button>
            </div>

            <button onClick={onClose} className="btn-close-modal">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}