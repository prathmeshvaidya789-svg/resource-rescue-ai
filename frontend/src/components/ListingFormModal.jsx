import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, ShieldAlert, Info } from 'lucide-react';

export default function ListingFormModal({ isOpen, onClose, onSave, prefillData }) {
  const [formData, setFormData] = useState({
    title: prefillData?.title || '',
    type: prefillData?.type || 'offer',
    category: prefillData?.category || 'Reusable Electronics',
    description: prefillData?.description || '',
    quantity: prefillData?.quantity || '',
    condition: prefillData?.condition || 'Functional / Inspected',
    location: prefillData?.location || 'Downtown Community Hub',
    organization: prefillData?.organization || 'Community Organization',
    contact: prefillData?.contact || '',
    tags: prefillData?.tags ? prefillData.tags.join(', ') : '',
    safetyNotes: prefillData?.safetyNotes || '',
    estimatedImpactNote: prefillData?.estimatedImpactNote || ''
  });

  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setValidationError('Please enter a descriptive resource title.');
      return;
    }
    if (!formData.description.trim()) {
      setValidationError('Please provide background specifications or project context.');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    onSave({
      ...formData,
      tags: tagsArray
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Post Circular Resource</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Publish an available surplus or formal community request to the network.
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-icon" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {validationError && (
            <div className="alert-banner error" style={{ padding: '10px 14px', fontSize: '0.84rem' }}>
              <span>{validationError}</span>
            </div>
          )}

          {/* Type Switcher */}
          <div className="form-group">
            <label className="form-label">Resource Intent:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${formData.type === 'offer' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.84rem', justifyContent: 'center' }}
                onClick={() => setFormData({ ...formData, type: 'offer' })}
              >
                🎁 Surplus to Offer (Available)
              </button>
              <button
                type="button"
                className={`btn ${formData.type === 'request' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.84rem', justifyContent: 'center' }}
                onClick={() => setFormData({ ...formData, type: 'request' })}
              >
                🎯 Verified Community Need (Seeking)
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="res-title">Descriptive Title *</label>
            <input 
              id="res-title"
              type="text" 
              className="form-input" 
              placeholder="e.g. 15 Lenovo ThinkPad Laptops with Chargers"
              value={formData.title}
              onChange={e => {
                setFormData({ ...formData, title: e.target.value });
                if (validationError) setValidationError('');
              }}
              required
            />
          </div>

          {/* Category & Quantity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="res-cat">Category *</label>
              <select 
                id="res-cat"
                className="form-select"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Reusable Electronics">Reusable Electronics</option>
                <option value="Surplus Packaged Food">Surplus Packaged Food</option>
                <option value="Water Conservation">Water Conservation</option>
                <option value="Upcycling & Materials">Upcycling & Materials</option>
                <option value="Tools & Equipment">Tools & Equipment</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="res-quantity">Quantity / Units</label>
              <input 
                id="res-quantity"
                type="text" 
                className="form-input" 
                placeholder="e.g. 15 units, 40kg, 1,000L"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="res-desc">Description & Technical Specifications *</label>
            <textarea 
              id="res-desc"
              className="form-textarea" 
              rows={3}
              placeholder="Detail functional condition, packaging state, compatibility requirements, or recipient eligibility..."
              value={formData.description}
              onChange={e => {
                setFormData({ ...formData, description: e.target.value });
                if (validationError) setValidationError('');
              }}
              required
            />
          </div>

          {/* Location & Organization */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="res-location">Location / District</label>
              <input 
                id="res-location"
                type="text" 
                className="form-input" 
                placeholder="e.g. Downtown Logistics Terminal"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="res-org">Organization / Department</label>
              <input 
                id="res-org"
                type="text" 
                className="form-input" 
                placeholder="e.g. Metro Sustainability Hub"
                value={formData.organization}
                onChange={e => setFormData({ ...formData, organization: e.target.value })}
              />
            </div>
          </div>

          {/* Safety & Compliance Advisory */}
          <div className="form-group">
            <label className="form-label" htmlFor="res-safety">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={15} color="var(--amber-700)" />
                <span>Safety & Intake Compliance Notes</span>
              </span>
            </label>
            <input 
              id="res-safety"
              type="text" 
              className="form-input" 
              placeholder="e.g. NIST data wipe verified, factory seal intact, pressure limits, allergen warnings..."
              value={formData.safetyNotes}
              onChange={e => setFormData({ ...formData, safetyNotes: e.target.value })}
            />
            <div className="form-hint">
              Required for electrical hardware verification, food shelf-life compliance, or water sanitization certificates.
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label" htmlFor="res-tags">Tags (comma-separated)</label>
            <input 
              id="res-tags"
              type="text" 
              className="form-input" 
              placeholder="e.g. laptops, education, chargers, food-rescue, rainwater"
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              <span>Publish Resource</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
