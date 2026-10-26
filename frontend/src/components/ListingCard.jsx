import React from 'react';
import { 
  MapPin, 
  Building2, 
  ArrowRight, 
  Trash2, 
  ShieldAlert, 
  Layers, 
  CheckCircle2, 
  Zap,
  Tag
} from 'lucide-react';

export default function ListingCard({ listing, onFindMatches, onStatusChange, onDelete }) {
  const isOffer = listing.type === 'offer';
  
  return (
    <article className="listing-card">
      <div>
        {/* Top Badges & Availability Status */}
        <div className="card-header-pills">
          <div className="badge-group">
            <span className={`badge ${isOffer ? 'badge-offer' : 'badge-request'}`}>
              {isOffer ? 'Offer' : 'Need'}
            </span>
            <span className="badge badge-category">
              {listing.category}
            </span>
            {listing.isDemoData && (
              <span className="badge badge-demo" title="Curated demo data for platform demonstration">
                Demo
              </span>
            )}
          </div>

          <select 
            className="status-dropdown"
            value={listing.status || 'available'}
            onChange={(e) => onStatusChange(listing.id, e.target.value)}
            aria-label="Listing Status"
          >
            <option value="available">● Available</option>
            <option value="matched">● Matched</option>
            <option value="completed">● Completed</option>
          </select>
        </div>

        {/* Title */}
        <h3 className="card-title">{listing.title}</h3>

        {/* Description */}
        <p className="card-description">{listing.description}</p>

        {/* Specifications List */}
        <div className="card-specs-list">
          {listing.quantity && (
            <div className="spec-row">
              <Layers size={14} color="var(--forest-600)" />
              <span><strong>Quantity:</strong> {listing.quantity} {listing.condition ? `(${listing.condition})` : ''}</span>
            </div>
          )}

          {listing.location && (
            <div className="spec-row">
              <MapPin size={14} color="var(--forest-600)" />
              <span><strong>Location:</strong> {listing.location}</span>
            </div>
          )}

          {listing.organization && (
            <div className="spec-row">
              <Building2 size={14} color="var(--forest-600)" />
              <span><strong>Organization:</strong> {listing.organization}</span>
            </div>
          )}
        </div>

        {/* Safety & Intake Guidelines Callout */}
        {listing.safetyNotes && (
          <div className="card-safety-callout">
            <div className="card-safety-header">
              <ShieldAlert size={14} />
              <span>Safety & Intake Compliance</span>
            </div>
            <div>{listing.safetyNotes}</div>
          </div>
        )}

        {/* Estimated Impact Note */}
        {listing.estimatedImpactNote && (
          <div className="card-impact-note">
            {listing.estimatedImpactNote}
          </div>
        )}
      </div>

      {/* Card Action Bar */}
      <div className="card-action-bar">
        <button 
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => onFindMatches(listing)}
          style={{ flex: 1 }}
        >
          <Zap size={14} />
          <span>Find Direct Matches</span>
        </button>

        <button 
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onDelete(listing.id)}
          title="Remove listing"
          aria-label="Delete listing"
          style={{ color: 'var(--rose-700)', padding: '6px 10px' }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  );
}
