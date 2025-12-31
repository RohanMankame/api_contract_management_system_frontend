import { useState } from 'react';
import '../styles/components/EntityModal.css';

export function EntityModal({ isOpen, title, fields, onSubmit, onClose }) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(formData);
      setFormData({});
      onClose(); // Close modal on successful submission
    } catch (err) {
      let errorMessage;
      const errors = err.response?.data?.errors;
      
      if (errors && typeof errors === 'object') {
        // If errors is an object with field names as keys, display all errors
        errorMessage = Object.entries(errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join('; ');
      } else {
        // Fallback to general error message
        errorMessage = err.response?.data?.message ||
                      err.message ||
                      'An unexpected error occurred';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close 
  const handleClose = () => {
    setFormData({});
    setError(null);
    onClose();
  };

  // Group fields by their group property
  const groupedFields = fields.reduce((acc, field) => {
    const groupKey = field.group || `solo-${field.name}`;
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(field);
    return acc;
  }, {});

  // Don't render modal if not open
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

        <form onSubmit={handleSubmit} className="modal-form">
          {Object.entries(groupedFields).map(([groupKey, groupedFieldsList]) => (
            <div 
              key={groupKey} 
              className={groupedFieldsList.length > 1 ? 'form-group-row' : 'form-group-wrapper'}
            >
              {groupedFieldsList.map(field => (
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
            </div>
          ))}
          
          <div className="modal-footer">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-submit">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}