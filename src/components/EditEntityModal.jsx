// src/components/EditEntityModal.jsx
import { useState, useEffect } from 'react';
import '../styles/components/EditEntityModal.css';

export function EditEntityModal({ isOpen, title, fields, data, onSubmit, onDelete, onClose }) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data && isOpen) {
      const initialData = {};
      fields.forEach(field => {
        initialData[field.name] = data[field.name] || '';
      });
      setFormData(initialData);
      setShowDeleteConfirm(false);
      setError(null); // Clear error when opening with new data
    }
  }, [data, isOpen, fields]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Clear previous errors
    try {
      await onSubmit(formData);
      setFormData({});
      setError(null); // Clear error on success
    } catch (err) {
      // Extract error message from the error object
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message ||
                          'An unexpected error occurred';
      setError(errorMessage);
      // Don't close the modal - keep it open to show the error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    setError(null); // Clear previous errors
    try {
      await onDelete(data.id);
      setFormData({});
      setError(null); // Clear error on success
    } catch (err) {
      // Extract error message from the error object
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message ||
                          'An unexpected error occurred';
      setError(errorMessage);
      setShowDeleteConfirm(false); // Hide delete confirm on error
      // Don't close the modal - keep it open to show the error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setError(null); // Clear error when closing
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        {error && (
          <div className="modal-error-message">
            {error}
          </div>
        )}

        {showDeleteConfirm ? (
          <div className="modal-delete-confirm">
            <p>Are you sure you want to archive this item? </p>
            <div className="modal-footer">
              <div></div>
              <div className="modal-footer-right">
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
                  disabled={isSubmitting}
                  className="btn-delete"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="modal-form">
              {fields.map(field => (
                <div key={field.name} className="form-group">
                  <label htmlFor={field.name}>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      required={field.required}
                      rows="4"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      id={field.name}
                      name={field.name}
                      checked={formData[field.name] || false}
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
              
              <div className="modal-footer">
                {onDelete && (
                  <button 
                    type="button" 
                    onClick={() => setShowDeleteConfirm(true)} 
                    className="btn-delete-modal"
                  >
                    Delete
                  </button>
                )}
                <div className="modal-footer-right">
                  <button type="button" onClick={handleClose} className="btn-cancel">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn-submit">
                    {isSubmitting ? 'Saving...' : 'Submit'}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}