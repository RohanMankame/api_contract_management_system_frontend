import React, { useState } from 'react';
import { RateCardInfo } from './RateCardInfo';
import BatchAddTiersModal from './BatchAddTiersModal';
import { EditEntityModal } from './EditEntityModal';
import { useApi } from '../hooks/useApi';
import '../styles/components/SubscriptionTierList.css';

export function SubscriptionTierList({
  subscriptionId,
  tiers,
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

  // Group tiers by date-only start/end (YYYY-MM-DD)
  const groupsMap = new Map();
  (Array.isArray(tiers) ? tiers : []).forEach(t => {
    const s = t.start_date ? new Date(t.start_date).toISOString().split('T')[0] : '';
    const e = t.end_date ? new Date(t.end_date).toISOString().split('T')[0] : '';
    const key = `${s}::${e}`;
    if (!groupsMap.has(key)) groupsMap.set(key, { start_date: s, end_date: e, tiers: [] });
    groupsMap.get(key).tiers.push(t);
  });

  const groups = Array.from(groupsMap.values()).sort((a, b) => (a.start_date || '').localeCompare(b.start_date || ''));

  const toggleGroup = (key) => {
    const next = new Set(expandedGroups);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setExpandedGroups(next);
  };

  const openEditModal = (tier) => {
    if (!tier) return;
    const fmt = (d) => (d ? new Date(d).toISOString().split('T')[0] : '');
    setEditingTier({ ...tier, start_date: fmt(tier.start_date), end_date: fmt(tier.end_date) });
    setShowEditModal(true);
  };

  const submitEdit = async (formData) => {
    if (!editingTier) return;
    await put(`/subscription-tiers/${editingTier.id}`, formData);
    setShowEditModal(false);
    setEditingTier(null);
    onEditTier && onEditTier();
  };

  const submitDelete = async () => {
    if (!editingTier) return;
    await deleteRequest(`/subscription-tiers/${editingTier.id}`);
    setShowEditModal(false);
    setEditingTier(null);
    onDeleteTier && onDeleteTier();
  };

  return (
    <>
      <div className="tiers-section">
        <div className="tiers-header">
          <h4>Tiers ({(tiers || []).length})</h4>
          <button onClick={() => setShowBatchAddModal(true)} className="btn-add-tier">+ Add Tier(s)</button>
        </div>

        <div className="tiers-list">
          {groups.length > 0 ? groups.map((group, idx) => {
            const key = `${group.start_date}::${group.end_date}::${idx}`;
            const isOpen = expandedGroups.has(key);
            return (
              <div key={key} className={`rate-card-container ${isOpen ? 'open' : ''}`}>
                <div className="rate-card-toggle" onClick={() => toggleGroup(key)}>
                  <div className="rate-card-toggle-left">
                    <strong>{group.start_date ? new Date(group.start_date).toLocaleDateString() : 'N/A'} → {group.end_date ? new Date(group.end_date).toLocaleDateString() : 'N/A'}</strong>
                  </div>
                  <div className="rate-card-toggle-right">
                    {pricing_type === 'Fixed' && <div className="rate-card-base-header">
                      </div>}
                    <small className="muted">{pricing_type}</small>
                    <span className={`expand-icon ${isOpen ? 'expanded' : ''}`}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="group-body">
                    <RateCardInfo group={group} pricingType={pricing_type} onEditTier={openEditModal} />
                  </div>
                )}
              </div>
            );
          }) : <div className="no-tiers"><p>No tiers yet.</p></div>}
        </div>
      </div>

      <BatchAddTiersModal isOpen={showBatchAddModal} onClose={() => setShowBatchAddModal(false)} subscriptionId={subscriptionId} pricingType={pricing_type} onAdded={() => { setShowBatchAddModal(false); onAddTier && onAddTier(); }} />

      <EditEntityModal isOpen={showEditModal} title="Edit Tier" fields={[
        { name: 'min_calls', label: 'Min Calls', type: 'number', required: true },
        { name: 'max_calls', label: 'Max Calls', type: 'number', required: true },
        { name: 'base_price', label: 'Base Price', type: 'number', required: true },
        { name: 'price_per_tier', label: 'Price Per Tier', type: 'number', required: false },
        { name: 'start_date', label: 'Start Date', type: 'date', required: true },
        { name: 'end_date', label: 'End Date', type: 'date', required: false },
      ]} data={editingTier} onSubmit={submitEdit} onDelete={submitDelete} onClose={() => { setShowEditModal(false); setEditingTier(null); }} />
    </>
  );
}