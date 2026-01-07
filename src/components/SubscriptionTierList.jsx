import React, { useState } from 'react';
import { RateCardInfo } from './RateCardInfo';
import BatchAddTiersModal from './BatchAddTiersModal';
import { EditEntityModal } from './EditEntityModal';
import { useApi } from '../hooks/useApi';
import '../styles/components/SubscriptionTierList.css';

export function SubscriptionTierList({
  subscriptionId,
  tiers,
  expandedTiers,
  onToggleExpand,
  onAddTier,
  onEditTier,
  onDeleteTier,
  pricing_type = 'Variable'
}) {
  const [showBatchAddModal, setShowBatchAddModal] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const { put, delete: deleteRequest } = useApi();

  const formFields = [
    { name: 'min_calls', label: 'Min Calls', type: 'number', required: true, group: 'calls' },
    { name: 'max_calls', label: 'Max Calls', type: 'number', required: true, group: 'calls' },
    { name: 'base_price', label: 'Base Price', type: 'number', required: true },
    { name: 'price_per_tier', label: 'Price Per Tier', type: 'number', required: false },
    { name: 'start_date', label: 'Start Date', type: 'date', required: true, group: 'dates' },
    { name: 'end_date', label: 'End Date', type: 'date', required: false, group: 'dates' },
  ];

  const openEditModal = (tier) => {
    if (!tier) return;
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    setEditingTier({
      ...tier,
      start_date: formatDateForInput(tier.start_date),
      end_date: formatDateForInput(tier.end_date)
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (formData) => {
    if (!editingTier) return;
    await put(`/subscription-tiers/${editingTier.id}`, formData);
    setShowEditModal(false);
    setEditingTier(null);
    onEditTier && onEditTier();
  };

  const handleDeleteSubmit = async () => {
    if (!editingTier) return;
    await deleteRequest(`/subscription-tiers/${editingTier.id}`);
    setShowEditModal(false);
    setEditingTier(null);
    onDeleteTier && onDeleteTier();
  };

  const safeTiers = Array.isArray(tiers) ? tiers : [];

  // Group tiers by date-only start/end (YYYY-MM-DD string equality)
  const groupsMap = new Map();
  safeTiers.forEach(t => {
    const s = t.start_date ? new Date(t.start_date).toISOString().split('T')[0] : '';
    const e = t.end_date ? new Date(t.end_date).toISOString().split('T')[0] : '';
    const key = `${s}::${e}`;
    if (!groupsMap.has(key)) {
      groupsMap.set(key, { start_date: s, end_date: e, tiers: [] });
    }
    groupsMap.get(key).tiers.push(t);
  });

  // Sort groups by start_date
  const groups = Array.from(groupsMap.values()).sort((a, b) => (a.start_date || '').localeCompare(b.start_date || ''));

  const toggleGroup = (key) => {
    const next = new Set(expandedGroups);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setExpandedGroups(next);
  };

  const fmtDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const groupBounds = (group) => {
    // compute min and max across group tiers
    const mins = group.tiers.map(t => Number(t.min_calls) || 0);
    const maxs = group.tiers.map(t => Number(t.max_calls) || 0);
    const minCalls = mins.length ? Math.min(...mins) : 'N/A';
    const maxCalls = maxs.length ? Math.max(...maxs) : 'N/A';
    return { minCalls, maxCalls };
  };

  return (
    <>
      <div className="tiers-section">
        <div className="tiers-header">
          <h4>Tiers ({safeTiers.length})</h4>
          <button onClick={() => setShowBatchAddModal(true)} className="btn-add-tier">
            + Add Tier(s)
          </button>
        </div>

        <div className="tiers-list"> 
          {groups.length > 0 ? (
            groups.map((group, idx) => {
              const key = `${group.start_date}::${group.end_date}::${idx}`;
              const isOpen = expandedGroups.has(key);
              const { minCalls, maxCalls } = groupBounds(group);
              const basePrice = group.tiers[0]?.base_price ?? null;

              return (
                <div key={key} className={`rate-card-container ${isOpen ? 'open' : ''}`}>
                  <div className="rate-card-toggle" onClick={() => toggleGroup(key)}>
                    <div className="rate-card-toggle-left">
                     
                      <strong>{fmtDate(group.start_date)} → {fmtDate(group.end_date)}</strong>
                      
                    </div>
                    

                    <div className="rate-card-toggle-right">
                      {pricing_type === 'Fixed' && (
                        <div className="rate-card-base-header">Base: {basePrice ? `$${parseFloat(basePrice).toFixed(2)}` : 'N/A'}</div>
                      )}
                      <small className="muted">{pricing_type}</small>
                      <span className={`expand-icon ${isOpen ? 'expanded' : ''}`}>{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="group-body">
                      {group.tiers.map((t, i) => (
                        <React.Fragment key={t.id}>
                          <RateCardInfo
                            tier={t}
                            onEdit={(tier) => openEditModal(tier)}
                            grouped={true}
                            pricingType={pricing_type}
                            onEditTier={(tier) => openEditModal(tier)}
                          />
                          {i < group.tiers.length - 1 && <hr className="group-separator" />}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-tiers">
              <p>No tiers yet.</p>
            </div>
          )}
        </div>
      </div>

      <BatchAddTiersModal
        isOpen={showBatchAddModal}
        onClose={() => setShowBatchAddModal(false)}
        subscriptionId={subscriptionId}
        pricingType={pricing_type}
        onAdded={() => {
          setShowBatchAddModal(false);
          onAddTier && onAddTier();
        }}
      />

      <EditEntityModal
        isOpen={showEditModal}
        title="Edit Tier"
        fields={formFields}
        data={editingTier}
        onSubmit={handleEditSubmit}
        onDelete={handleDeleteSubmit}
        onClose={() => {
          setShowEditModal(false);
          setEditingTier(null);
        }}
      />
    </>
  );
}