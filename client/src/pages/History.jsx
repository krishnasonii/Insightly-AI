import React, { useEffect, useState } from 'react';
import { Search, ExternalLink, Calendar, Clock, MessageSquare, Sparkles, X, ChevronRight, Hash } from 'lucide-react';
import axios from 'axios';

const History = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:5001/api/meetings', {
          headers: { 'x-auth-token': token }
        });
        setMeetings(res.data);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to sync history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Archive Date';
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredMeetings = meetings.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.transcript && m.transcript.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="history-wrapper animate-fade-in">
      <div className="history-header glass">
        <div className="title-block">
          <h1>Session Archive</h1>
          <p>Access your organization's intelligent meeting memory.</p>
        </div>
        <div className="search-box-glass">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Scan transcripts & titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-grid">
          {[1, 2, 3].map(i => <div key={i} className="skeleton-card glass" />)}
        </div>
      ) : error ? (
        <div className="error-card glass">
          <p>{error}</p>
        </div>
      ) : (
        <div className="history-grid">
          {filteredMeetings.length > 0 ? filteredMeetings.map((recap) => (
            <div key={recap._id} className="history-card-premium glass group hover:scale-[1.02] transition-all">
              <div className="card-top">
                <div className="id-badge">
                  <Hash size={12} />
                  <span>{recap._id.slice(-6)}</span>
                </div>
                <div className="card-actions">
                  <button className="btn-details" onClick={() => setSelectedMeeting(recap)}>
                    <span>View Intelligence</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="card-content">
                <h3 className="title">{recap.title || 'Untitled Session'}</h3>
                <div className="meta-row">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{formatDate(recap.createdAt)}</span>
                  </div>
                  <div className="meta-divider" />
                  <div className="meta-item">
                    <Clock size={14} />
                    <span>{recap.duration || '0:00'}</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div className="preview-tags">
                  {recap.summary && recap.summary.length > 0 && (
                    <span className="tag-summary">
                      <Sparkles size={12} />
                      AI Summary Ready
                    </span>
                  )}
                  <span className="tag-transcript">
                    <MessageSquare size={12} />
                    Full Transcript
                  </span>
                </div>
              </div>
            </div>
          )) : (
            <div className="empty-state glass">
              <div className="empty-icon">
                <Search size={48} />
              </div>
              <h3>No matches found</h3>
              <p>Try refining your search terms or start a new session.</p>
            </div>
          )}
        </div>
      )}

      {selectedMeeting && (
        <div className="detail-overlay" onClick={() => setSelectedMeeting(null)}>
          <div className="detail-modal glass animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <div className="icon-main">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2>{selectedMeeting.title}</h2>
                  <p>{formatDate(selectedMeeting.createdAt)} • {selectedMeeting.duration}</p>
                </div>
              </div>
              <button className="btn-close" onClick={() => setSelectedMeeting(null)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-scroll-area">
              {selectedMeeting.summary && selectedMeeting.summary.length > 0 && (
                <section className="detail-section">
                  <h4 className="section-label">AI Executive Summary</h4>
                  <div className="summary-block">
                    {Array.isArray(selectedMeeting.summary) ? (
                      selectedMeeting.summary.map((point, i) => <p key={i}>{point}</p>)
                    ) : (
                      <p>{selectedMeeting.summary}</p>
                    )}
                  </div>
                </section>
              )}

              <section className="detail-section">
                <h4 className="section-label">Meeting Transcript</h4>
                <div className="transcript-block">
                  {selectedMeeting.transcript ? (
                    <p>{selectedMeeting.transcript}</p>
                  ) : (
                    <div className="no-transcript">
                      <p>No transcript generated for this session.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      <style>{`
                .history-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    padding-top: 3rem;
                }
                .history-header {
                    padding: 3rem;
                    border-radius: 3rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 2rem;
                }
                .title-block h1 {
                    font-size: 2.5rem;
                    font-weight: 950;
                    letter-spacing: -0.05em;
                    color: var(--text-main);
                    margin-bottom: 0.5rem;
                }
                .title-block p {
                    color: var(--text-muted);
                    font-size: 1.1rem;
                }
                .search-box-glass {
                    flex: 1;
                    max-width: 450px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--surface-border);
                    border-radius: 1.5rem;
                    padding: 0.25rem 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    transition: all 0.3s ease;
                }
                .search-box-glass:focus-within {
                    background: rgba(255, 255, 255, 0.07);
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }
                .search-icon { color: var(--text-muted); }
                .search-box-glass input {
                    width: 100%;
                    background: transparent;
                    border: none;
                    outline: none;
                    color: white;
                    padding: 1rem 0;
                    font-size: 1rem;
                    font-weight: 500;
                }

                .history-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
                    gap: 1.5rem;
                }
                .history-card-premium {
                    padding: 2rem;
                    border-radius: 2.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    border: 1px solid var(--surface-border);
                }
                .card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .id-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.4rem 0.8rem;
                    border-radius: 1rem;
                    font-family: monospace;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
                .btn-details {
                    background: transparent;
                    border: none;
                    color: var(--primary);
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .card-content .title {
                    font-size: 1.4rem;
                    font-weight: 800;
                    color: var(--text-main);
                    margin-bottom: 0.75rem;
                }
                .meta-row {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    color: var(--text-muted);
                }
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                .meta-divider {
                    width: 4px;
                    height: 4px;
                    background: var(--surface-border);
                    border-radius: 50%;
                }
                .preview-tags {
                    display: flex;
                    gap: 0.75rem;
                }
                .tag-summary, .tag-transcript {
                    padding: 0.5rem 1rem;
                    border-radius: 1rem;
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .tag-summary { background: rgba(99, 102, 241, 0.1); color: var(--primary); }
                .tag-transcript { background: rgba(255, 255, 255, 0.05); color: var(--text-muted); }

                .detail-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(12px);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                .detail-modal {
                    width: 100%;
                    max-width: 900px;
                    max-height: 85vh;
                    border-radius: 3.5rem;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid var(--surface-border);
                }
                .modal-header {
                    padding: 3rem;
                    border-bottom: 1px solid var(--surface-border);
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .modal-title {
                    display: flex;
                    gap: 1.5rem;
                }
                .icon-main {
                    width: 64px;
                    height: 64px;
                    background: var(--grad-main);
                    border-radius: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                .modal-title h2 { font-size: 2rem; font-weight: 900; margin-bottom: 0.25rem; }
                .modal-title p { font-weight: 700; color: var(--text-muted); opacity: 0.7; }
                .btn-close {
                    background: rgba(255, 255, 255, 0.05);
                    border: none;
                    color: white;
                    width: 48px;
                    height: 48px;
                    border-radius: 1.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .btn-close:hover { background: #ef4444; color: white; transform: rotate(90deg); }
                
                .modal-scroll-area {
                    flex: 1;
                    padding: 3rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                }
                .section-label {
                    font-size: 0.8rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--primary);
                    margin-bottom: 1.5rem;
                }
                .summary-block, .transcript-block {
                    padding: 2.5rem;
                    border-radius: 2rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--surface-border);
                    line-height: 1.8;
                    color: var(--text-main);
                    font-size: 1.1rem;
                }
                .summary-block p { margin-bottom: 1rem; position: relative; padding-left: 1.5rem; }
                .summary-block p::before {
                    content: '•';
                    position: absolute;
                    left: 0;
                    color: var(--primary);
                    font-weight: 950;
                }
                .no-transcript { color: var(--text-muted); font-style: italic; text-align: center; padding: 2rem; }

                .skeleton-card { height: 280px; border-radius: 2.5rem; }
                .empty-state { padding: 5rem; text-align: center; border-radius: 3rem; grid-column: 1 / -1; }
                .empty-icon { color: var(--text-muted); opacity: 0.2; margin-bottom: 1.5rem; }
                .empty-state h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
                .empty-state p { color: var(--text-muted); }

                @media (max-width: 768px) {
                    .history-header { flex-direction: column; text-align: center; padding: 2rem; }
                    .detail-modal { max-height: 95vh; border-radius: 2rem; }
                    .modal-header, .modal-scroll-area { padding: 1.5rem; }
                    .modal-title h2 { font-size: 1.5rem; }
                }
            `}</style>
    </div>
  );
};

export default History;
