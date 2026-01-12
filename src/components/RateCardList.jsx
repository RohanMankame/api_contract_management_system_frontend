import React, { useState } from 'react';
import { RateCardInfo } from './RateCardInfo';
import { EditEntityModal } from './EditEntityModal';
import { useApi } from '../hooks/useApi';
import BatchAddTiersModal from './BatchAddTiersModal';
import '../styles/components/SubscriptionTierList.css';

export function RateCardList({
  subscriptionId,
  rateCards = [],
  pricingType = 'Variable',
  onRateCardUpdate,
  onAddTier,
  onEditTier,
  onDeleteTier
}) {
  const [expandedRateCards, setExpandedRateCards] = useState(new Set());
  const [showAddRateCardModal, setShowAddRateCardModal] = useState(false);
  const [editingRateCard, setEditingRateCard] = useState(null);
  const [showEditRateCardModal, setShowEditRateCardModal] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [showEditTierModal, setShowEditTierModal] = useState(false);
  const [showBatchAddTiersModal, setShowBatchAddTiersModal] = useState(false);
  const [selectedRateCardForTiers, setSelectedRateCardForTiers] = useState(null);
  
  const { post, put, delete: deleteRequest } = useApi();

  // Helper to format ISO date to yyyy-MM-dd
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  const isFixed = pricingType === 'Fixed';

  const toggleRateCardExpand = (rateCardId) => {
    const next = new Set(expandedRateCards);
    if (next.has(rateCardId)) next.delete(rateCardId);
    else next.add(rateCardId);
    setExpandedRateCards(next);
  };

  const handleAddRateCard = async (formData) => {
    try {
      await post('/rate-cards', {
        subscription_id: subscriptionId,
        start_date: formData.start_date,
        end_date: formData.end_date
      });
      setShowAddRateCardModal(false);
      onRateCardUpdate && onRateCardUpdate();
    } catch (err) {
      console.error('Error adding rate card:', err);
    }
  };

  const handleEditRateCard = async (formData) => {
    if (!editingRateCard) return;
    try {
      await put(`/rate-cards/${editingRateCard.id}`, {
        start_date: formData.start_date,
        end_date: formData.end_date
      });
      setShowEditRateCardModal(false);
      setEditingRateCard(null);
      onRateCardUpdate && onRateCardUpdate();
    } catch (err) {
      console.error('Error updating rate card:', err);
    }
  };

  const handleDeleteRateCard = async () => {
    if (!editingRateCard) return;
    try {
      await deleteRequest(`/rate-cards/${editingRateCard.id}`);
      setShowEditRateCardModal(false);
      setEditingRateCard(null);
      onRateCardUpdate && onRateCardUpdate();
    } catch (err) {
      console.error('Error deleting rate card:', err);
    }
  };

  const handleEditTier = (tier) => {
    setEditingTier(tier);
    setShowEditTierModal(true);
  };

  const handleSubmitEditTier = async (formData) => {
    if (!editingTier) return;
    try {
      const submitData = isFixed 
        ? { unit_price: formData.unit_price }
        : {
            min_calls: formData.min_calls,
            max_calls: formData.max_calls,
            unit_price: formData.unit_price
          };
      
      await put(`/subscription-tiers/${editingTier.id}`, submitData);
      setShowEditTierModal(false);
      setEditingTier(null);
      onEditTier && onEditTier();
      onRateCardUpdate && onRateCardUpdate();
    } catch (err) {
      console.error('Error updating tier:', err);
    }
  };

  const handleSubmitDeleteTier = async () => {
    if (!editingTier) return;
    try {
      await deleteRequest(`/subscription-tiers/${editingTier.id}`);
      setShowEditTierModal(false);
      setEditingTier(null);
      onDeleteTier && onDeleteTier();
      onRateCardUpdate && onRateCardUpdate();
    } catch (err) {
      console.error('Error deleting tier:', err);
    }
  };

  const handleOpenAddTiersModal = (rateCard) => {
    // For fixed pricing, check if tier already exists
    if (isFixed && rateCard.tiers && rateCard.tiers.length > 0) {
      alert('Fixed pricing rate cards can only have one tier. Edit the existing tier instead.');
      return;
    }

    // For variable pricing, check if last tier has infinity max_calls
    if (!isFixed && rateCard.tiers && rateCard.tiers.length > 0) {
      const nonArchivedTiers = rateCard.tiers.filter(t => !t.is_archived);
      if (nonArchivedTiers.length > 0) {
        const sorted = [...nonArchivedTiers].sort((a, b) => {
          const aMax = Number(a.max_calls ?? 0);
          const bMax = Number(b.max_calls ?? 0);
          return bMax - aMax; 
        });
        const lastTier = sorted[0];
        if (lastTier.max_calls === -1) {
          alert('Cannot add a new tier when the last tier has infinite max calls. Edit or delete the existing tier first.');
          return;
        }
      }
    }
    
    setSelectedRateCardForTiers(rateCard);
    setShowBatchAddTiersModal(true);
  };

  const handleTiersAdded = () => {
    setShowBatchAddTiersModal(false);
    setSelectedRateCardForTiers(null);
    onRateCardUpdate && onRateCardUpdate();
  };

  const rateCardsArray = Array.isArray(rateCards) ? rateCards : [];

  return (
    <>
      <div className="rate-cards-section">
        <div className="rate-cards-header">
          <h4>Rate Cards ({rateCardsArray.length})</h4>
          <button 
            onClick={() => setShowAddRateCardModal(true)} 
            className="btn-add-rate-card"
          >
            + Add Rate Card
          </button>
        </div>

        <div className="rate-cards-list">
          {rateCardsArray.length > 0 ? (
            rateCardsArray.map(rateCard => {
              const isOpen = expandedRateCards.has(rateCard.id);
              return (
                <div key={rateCard.id} className={`rate-card-container ${isOpen ? 'open' : ''}`}>
                  <div 
                    className="rate-card-toggle"
                    onClick={() => toggleRateCardExpand(rateCard.id)}
                  >
                    <div className="rate-card-toggle-left">
                      <strong>
                        {rateCard.start_date ? new Date(rateCard.start_date).toLocaleDateString() : 'N/A'} 
                        {' → '}
                        {rateCard.end_date ? new Date(rateCard.end_date).toLocaleDateString() : 'N/A'}
                      </strong>
                    </div>
                    <div className="rate-card-toggle-right">
                      <small className="muted">{rateCard.tiers ? rateCard.tiers.length : 0} tiers</small>
                      <span className={`expand-icon ${isOpen ? 'expanded' : ''}`}>
                        {isOpen ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="rate-card-content">
                      <RateCardInfo 
                        rateCard={rateCard} 
                        pricingType={pricingType}
                        onEditTier={handleEditTier}
                      />
                      <div className="rate-card-actions">
                        <button 
                          onClick={() => {
                            setEditingRateCard(rateCard);
                            setShowEditRateCardModal(true);
                          }}
                          className="btn-edit-rate-card"
                        >
                          Edit Rate Card
                        </button>
                        {!(isFixed && rateCard.tiers && rateCard.tiers.length > 0) && (
                          <button 
                            onClick={() => handleOpenAddTiersModal(rateCard)}
                            className="btn-add-tier"
                          >
                            + Add Tier
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-rate-cards">
              <p>No rate cards yet. Create one to add tiers.</p>
            </div>
          )}
        </div>
      </div>

     
      <EditEntityModal
        isOpen={showAddRateCardModal}
        title="Add Rate Card"
        fields={[
          { name: 'start_date', label: 'Start Date', type: 'date', required: true },
          { name: 'end_date', label: 'End Date', type: 'date', required: true },
        ]}
        data={{}}
        onSubmit={handleAddRateCard}
        onClose={() => setShowAddRateCardModal(false)}
      />

      
      <EditEntityModal
        isOpen={showEditRateCardModal}
        title="Edit Rate Card"
        fields={[
          { name: 'start_date', label: 'Start Date', type: 'date', required: true },
          { name: 'end_date', label: 'End Date', type: 'date', required: true },
        ]}
        data={editingRateCard ? {
          ...editingRateCard,
          start_date: formatDateForInput(editingRateCard.start_date),
          end_date: formatDateForInput(editingRateCard.end_date)
        } : {}}
        onSubmit={handleEditRateCard}
        onDelete={handleDeleteRateCard}
        onClose={() => {
          setShowEditRateCardModal(false);
          setEditingRateCard(null);
        }}
      />


      <EditEntityModal
        isOpen={showEditTierModal}
        title={isFixed ? 'Edit Base Price' : 'Edit Tier'}
        fields={isFixed ? [
          { name: 'unit_price', label: 'Base Price', type: 'number', required: true, step: '0.01' },
        ] : [
          { name: 'min_calls', label: 'Min Calls', type: 'number', required: true },
          { name: 'max_calls', label: 'Max Calls', type: 'number', required: true },
          { name: 'unit_price', label: 'Unit Price', type: 'number', required: true, step: '0.01' },
        ]}
        data={editingTier || {}}
        onSubmit={handleSubmitEditTier}
        onDelete={handleSubmitDeleteTier}
        onClose={() => {
          setShowEditTierModal(false);
          setEditingTier(null);
        }}
      />

      
      <BatchAddTiersModal
        isOpen={showBatchAddTiersModal}
        onClose={() => {
          setShowBatchAddTiersModal(false);
          setSelectedRateCardForTiers(null);
        }}
        rateCardId={selectedRateCardForTiers?.id}
        rateCard={selectedRateCardForTiers}
        pricingType={pricingType}
        onAdded={handleTiersAdded}
      />
    </>
  );
}