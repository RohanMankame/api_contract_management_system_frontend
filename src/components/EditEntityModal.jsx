import { useState, useEffect } from 'react';
import '../styles/components/EditEntityModal.css';

export function EditEntityModal({ isOpen, title, fields, data, onSubmit, onDelete, onClose }) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (data && isOpen) {
      const initialData = {};
      fields.forEach(field => {
        initialData[field.name] = data[field.name] || '';
      });
      setFormData(initialData);
      setShowDeleteConfirm(false);
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
    try {
      await onSubmit(formData);
      setFormData({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDelete(data.id);
      setFormData({});
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        {showDeleteConfirm ? (
          <div className="modal-delete-confirm">
            <p>Are you sure you want to archive this item? </p>
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
                disabled={isSubmitting}
                className="btn-delete"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
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
                <button 
                  type="button" 
                  onClick={() => setShowDeleteConfirm(true)} 
                  className="btn-delete-secondary"
                >
                  Delete
                </button>
                <div className="modal-footer-right">
                  <button type="button" onClick={onClose} className="btn-cancel">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn-submit">
                    {isSubmitting ? 'Updating...' : 'Update'}
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