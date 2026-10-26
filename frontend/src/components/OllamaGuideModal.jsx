import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  RefreshCw,
  Cpu,
  Check
} from 'lucide-react';

export default function OllamaGuideModal({ isOpen, onClose, backendStatus, onRefreshStatus }) {
  const [copiedCmd, setCopiedCmd] = useState(null);
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleTest = async () => {
    setTesting(true);
    await onRefreshStatus();
    setTesting(false);
  };

  const isOnline = backendStatus?.ollama_available;
  const installedModels = backendStatus?.installed_models || [];
  const has3b = backendStatus?.is_preferred_installed;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={20} color="var(--forest-800)" />
            <h3>Local Ollama AI Configuration</h3>
          </div>
          <button 
            type="button" 
            className="modal-close-icon" 
            onClick={onClose}
            aria-label="Close configuration modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Current Live Diagnostic Status Box */}
          <div style={{
            padding: '16px 18px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '24px',
            backgroundColor: isOnline 
              ? (has3b ? 'var(--forest-50)' : 'var(--amber-50)')
              : 'var(--rose-50)',
            border: `1px solid ${
              isOnline 
                ? (has3b ? 'var(--forest-100)' : 'var(--amber-100)')
                : 'var(--rose-100)'
            }`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.92rem' }}>
                {isOnline ? (
                  has3b ? (
                    <>
                      <CheckCircle2 size={18} color="var(--forest-700)" />
                      <span style={{ color: 'var(--forest-900)' }}>Local Ollama Online • qwen2.5:3b Ready</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={18} color="var(--amber-800)" />
                      <span style={{ color: 'var(--amber-800)' }}>Ollama Online (Fallback Model Active)</span>
                    </>
                  )
                ) : (
                  <>
                    <AlertCircle size={18} color="var(--rose-800)" />
                    <span style={{ color: 'var(--rose-800)' }}>Ollama Server Offline at localhost:11434</span>
                  </>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {isOnline 
                  ? `Active Model: ${backendStatus.active_model || 'qwen2.5:3b'} | Installed: [${installedModels.join(', ') || 'None'}]`
                  : 'Start Ollama desktop or run "ollama serve" in PowerShell.'}
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handleTest}
              disabled={testing}
            >
              <RefreshCw size={13} className={testing ? 'spinner-dark' : ''} />
              <span>{testing ? 'Checking...' : 'Test Connection'}</span>
            </button>
          </div>

          <h4 style={{ marginBottom: '14px', fontSize: '0.95rem', color: 'var(--forest-900)' }}>
            Windows Setup Instructions (If Ollama is not installed):
          </h4>

          {/* Step 1 */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>
              <span style={{ backgroundColor: 'var(--forest-100)', color: 'var(--forest-800)', width: '22px', height: '22px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>1</span>
              <span>Download & Install Ollama for Windows</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginLeft: '30px', marginBottom: '8px' }}>
              Download the official Windows setup binary from Ollama:
            </p>
            <div style={{ marginLeft: '30px' }}>
              <a 
                href="https://ollama.com/download/windows" 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <Download size={14} />
                <span>Download Ollama for Windows (ollama.com)</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>
              <span style={{ backgroundColor: 'var(--forest-100)', color: 'var(--forest-800)', width: '22px', height: '22px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>2</span>
              <span>Start Ollama Server</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginLeft: '30px' }}>
              Launch Ollama from Windows Start Menu, or execute in PowerShell:
            </p>
            <div className="code-snippet" style={{ marginLeft: '30px' }}>
              <code>ollama serve</code>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                onClick={() => copyToClipboard('ollama serve', 'serve')}
              >
                {copiedCmd === 'serve' ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedCmd === 'serve' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>
              <span style={{ backgroundColor: 'var(--forest-100)', color: 'var(--forest-800)', width: '22px', height: '22px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>3</span>
              <span>Pull the qwen2.5:3b Model</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginLeft: '30px' }}>
              Download the circular economy inference model:
            </p>
            <div className="code-snippet" style={{ marginLeft: '30px' }}>
              <code>ollama pull qwen2.5:3b</code>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                onClick={() => copyToClipboard('ollama pull qwen2.5:3b', 'pull3b')}
              >
                {copiedCmd === 'pull3b' ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedCmd === 'pull3b' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Low Spec Option */}
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}>
            <strong>Low RAM Laptop Fallback (&lt; 8GB RAM):</strong> If your hardware is constrained during the demo, run <code>ollama pull qwen2.5:0.5b</code>. Resource Rescue AI automatically detects and uses it seamlessly.
          </div>
        </div>
      </div>
    </div>
  );
}
