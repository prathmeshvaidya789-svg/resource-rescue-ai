import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  ListChecks, 
  Lightbulb, 
  Share2, 
  ArrowRight,
  HelpCircle,
  Clock,
  Cpu,
  Layers,
  Info
} from 'lucide-react';
import { analyzeResource } from '../services/api';

const INSPIRATION_TEMPLATES = [
  {
    label: '💻 15 Decommissioned Office Laptops',
    title: 'Surplus of 15 operational Lenovo ThinkPad laptops with power adapters',
    type: 'offer',
    desc: 'Our professional services firm is replacing 15 working Intel Core i5 ThinkPad laptops with original chargers. We want to avoid e-waste and donate them securely to students or non-profit educational programs.'
  },
  {
    label: '🥫 35kg Packaged Bakery Inventory',
    title: 'Commercial overage of 35kg factory-packaged artisan loaves, rolls, and sealed muffins',
    type: 'offer',
    desc: 'Our bakery commissary produces ~35kg of unsold, factory-packaged baked goods daily. They are hygienically sealed and safe for consumption within 48-72 hours, but need immediate distribution to avoid municipal disposal.'
  },
  {
    label: '💧 800L/Day Clean AC Condensation Runoff',
    title: 'Multi-family residential complex discarding 800L daily of AC condensation runoff',
    type: 'problem',
    desc: 'Our 40-unit building drains central AC condensation directly into municipal storm sewers. We are seeking a low-cost gravity capture and sedimentation filtration design for community garden landscape irrigation.'
  },
  {
    label: '🌱 Urban Community Farm Water Shortage',
    title: 'Community allotment cooperative urgently needs 1,000L rainwater storage tanks',
    type: 'request',
    desc: 'Our volunteer-run community garden supports 60 households but is under municipal drought conservation restrictions. We urgently need 1-2 food-grade bulk collection totes and micro-drip line.'
  }
];

export default function ProblemAnalyzer({ onAddListingAsDraft, onOpenOllamaGuide, backendStatus }) {
  const [submissionType, setSubmissionType] = useState('problem');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState('qwen2.5:3b');
  
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleApplyTemplate = (tmpl) => {
    setTitle(tmpl.title);
    setDescription(tmpl.desc);
    setSubmissionType(tmpl.type);
    setError(null);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!title.trim() && !description.trim()) {
      setError('Please provide at least a title or description to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setElapsed(0);

    const timer = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    try {
      const response = await analyzeResource({
        title,
        description,
        type: submissionType,
        model: selectedModel,
        allow_fallback: true
      });

      clearInterval(timer);
      setLoading(false);
      setAnalysisResult(response);
    } catch (err) {
      clearInterval(timer);
      setLoading(false);
      setError(err.message || 'An error occurred during AI analysis.');
    }
  };

  const handleConvertToListing = () => {
    if (!analysisResult?.analysis) return;
    const ai = analysisResult.analysis;

    const newDraft = {
      title: title || ai.summary || 'Rescued Circular Resource',
      description: `${description}\n\n[AI Impact Analysis]: ${ai.potential_impact || ''}`,
      category: ai.category || 'Reusable Electronics',
      type: submissionType === 'request' ? 'request' : 'offer',
      quantity: 'See analysis details',
      condition: 'Inspected via AI Plan',
      location: 'Local Community Hub',
      organization: 'Local Community Partner',
      tags: ai.suggested_tags || ['rescued', 'circular-economy'],
      safetyNotes: (ai.safety_warnings && ai.safety_warnings[0]) || 'Standard intake verification applies.',
      estimatedImpactNote: `Estimated AI Potential: ${ai.potential_impact || 'Positive circular diversion'}`
    };

    onAddListingAsDraft(newDraft);
  };

  const aiData = analysisResult?.analysis;

  return (
    <div className="lab-container">
      {/* Workbench Card */}
      <div className="lab-panel">
        <div className="lab-header">
          <div className="lab-title-group">
            <h2>
              <Sparkles size={22} color="var(--forest-700)" />
              <span>AI Solution Lab</span>
            </h2>
            <p>
              Formulate actionable circular economy pathways for surplus inventory, waste streams, or community resource requests using your local Ollama AI model.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={15} color="var(--forest-700)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Engine:</span>
            <select 
              className="form-select"
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              style={{ padding: '4px 10px', fontSize: '0.82rem', width: 'auto' }}
            >
              <option value="qwen2.5:3b">qwen2.5:3b (Recommended)</option>
              <option value="qwen2.5:0.5b">qwen2.5:0.5b (Fast Fallback)</option>
            </select>
          </div>
        </div>

        {/* Quick Demo Inspiration Buttons */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Curated Problem Scenarios:
          </div>
          <div className="inspiration-pills-row">
            {INSPIRATION_TEMPLATES.map((tmpl, idx) => (
              <button 
                key={idx}
                type="button"
                className="inspiration-btn"
                onClick={() => handleApplyTemplate(tmpl)}
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleAnalyze}>
          {/* Submission Objective */}
          <div className="form-group">
            <label className="form-label">Submission Category:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${submissionType === 'problem' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.84rem' }}
                onClick={() => setSubmissionType('problem')}
              >
                Operational Waste / Problem
              </button>
              <button
                type="button"
                className={`btn ${submissionType === 'offer' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.84rem' }}
                onClick={() => setSubmissionType('offer')}
              >
                Surplus Resource to Offer
              </button>
              <button
                type="button"
                className={`btn ${submissionType === 'request' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.84rem' }}
                onClick={() => setSubmissionType('request')}
              >
                Community Need to Request
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="problem-title">Resource or Challenge Title</label>
            <input 
              id="problem-title"
              type="text"
              className="form-input"
              placeholder="e.g. 15 Operational ThinkPad Laptops, 40kg Excess Bakery Flour, AC Runoff Collection"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="problem-description">Detailed Specifications & Current Status</label>
            <textarea 
              id="problem-description"
              className="form-textarea"
              placeholder="State quantities, packaging condition, location constraints, storage requirements, or specific operational challenges..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="alert-banner error">
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, marginBottom: '2px' }}>Ollama Engine Notification:</div>
                <div style={{ marginBottom: '8px' }}>{error}</div>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={onOpenOllamaGuide}
                  style={{ fontSize: '0.78rem' }}
                >
                  <HelpCircle size={13} />
                  <span>View Windows Setup Guide</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading Skeleton during Analysis */}
          {loading && (
            <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', fontWeight: 600, color: 'var(--forest-800)', fontSize: '0.88rem' }}>
                <div className="spinner-dark"></div>
                <span>Synthesizing circular solution with local {selectedModel}... ({elapsed}s elapsed)</span>
              </div>
              <div className="skeleton" style={{ height: '20px', width: '80%', marginBottom: '10px' }}></div>
              <div className="skeleton" style={{ height: '14px', width: '95%', marginBottom: '6px' }}></div>
              <div className="skeleton" style={{ height: '14px', width: '60%' }}></div>
            </div>
          )}

          {/* Submit Action */}
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Evaluating Resource with Ollama...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Run Circular Economy Analysis</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Structured AI Result Card */}
      {aiData && (
        <article className="ai-solution-result" aria-label="AI Generated Solution Plan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="ai-verified-tag">
                <Sparkles size={13} />
                <span>Ollama Analysis: {analysisResult.model_used}</span>
              </span>
              {analysisResult.eval_duration_ms && (
                <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>
                  Inference latency: {analysisResult.eval_duration_ms} ms
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-category">
                Category: {aiData.category}
              </span>
              <span className={`badge ${aiData.urgency_level === 'High' ? 'badge-request' : 'badge-offer'}`}>
                Urgency: {aiData.urgency_level}
              </span>
            </div>
          </div>

          {/* Summary & Impact */}
          <div style={{ marginBottom: '22px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-900)', marginBottom: '8px' }}>
              {aiData.summary}
            </h3>
            {aiData.potential_impact && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: 'var(--forest-800)', backgroundColor: 'var(--forest-50)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--forest-100)' }}>
                <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Estimated Potential Impact:</strong> {aiData.potential_impact}</span>
              </div>
            )}
          </div>

          {/* Practical Solutions & Target Beneficiaries */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', color: 'var(--forest-900)', marginBottom: '12px' }}>
              <Lightbulb size={17} color="var(--forest-700)" />
              <span>Recommended Repurposing Pathways</span>
            </h4>
            <div className="solution-pathway-grid">
              {(aiData.practical_solutions || []).map((sol, i) => (
                <div key={i} className="solution-pathway-card">
                  <h4>{sol.title}</h4>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    {sol.description}
                  </p>
                  {sol.target_recipient && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--forest-700)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                      <strong>Target Recipient:</strong> {sol.target_recipient}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Checklist */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', color: 'var(--forest-900)', marginBottom: '10px' }}>
              <ListChecks size={17} color="var(--forest-700)" />
              <span>Immediate Implementation Checklist</span>
            </h4>
            <ul className="checklist-box">
              {(aiData.action_steps || []).map((step, i) => (
                <li key={i} className="checklist-item">
                  <CheckCircle2 size={16} color="var(--forest-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety & Compliance Warnings */}
          <div style={{ marginBottom: '26px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', color: 'var(--rose-800)', marginBottom: '10px' }}>
              <ShieldAlert size={17} color="var(--rose-700)" />
              <span>Safety, Sanitation & Regulatory Guidelines</span>
            </h4>
            <div className="hazard-warning-box">
              {(aiData.safety_warnings || []).map((warn, i) => (
                <div key={i} className="hazard-warning-item">
                  <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Conversion CTA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Ready to execute this plan? Publish it directly to the circular marketplace:
            </div>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleConvertToListing}
            >
              <Share2 size={15} />
              <span>Publish to Discover Resources</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </article>
      )}
    </div>
  );
}
