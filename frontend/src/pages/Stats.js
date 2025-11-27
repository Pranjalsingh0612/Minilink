/**
 * Stats Page
 * Displays statistics for a specific short link
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLinkStats, getBaseUrl } from '../services/api';
import { formatTimestamp, copyToClipboard } from '../utils/helpers';
import Loading from '../components/Loading';

const Stats = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [code]);

  /**
   * Fetch link statistics
   */
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLinkStats(code);
      setLink(data);
    } catch (err) {
      setError(err.message || 'Failed to load link statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Copy short URL to clipboard
   */
  const handleCopy = async (text) => {
    try {
      await copyToClipboard(text);
      setSuccessMessage('Copied to clipboard!');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  /**
   * Navigate back to dashboard
   */
  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Link Statistics</h2>
          <button className="btn btn-secondary" onClick={handleBack}>
            ← Back to Dashboard
          </button>
        </div>

        {/* Loading State */}
        {loading && <Loading message="Loading statistics..." />}

        {/* Error State */}
        {!loading && error && (
          <div>
            <div className="error-message">{error}</div>
            <button className="btn btn-primary mt-2" onClick={handleBack}>
              Return to Dashboard
            </button>
          </div>
        )}

        {/* Success Message */}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {/* Stats Display */}
        {!loading && !error && link && (
          <div>
            {/* Short Code */}
            <div className="stat-card" style={{ marginBottom: '1.5rem' }}>
              <div className="stat-label">Short Code</div>
              <div className="stat-value" style={{ fontSize: '2.5rem' }}>
                {link.code}
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="stats-grid">
              {/* Long URL */}
              <div className="stat-card">
                <div className="stat-label">Original URL</div>
                <div
                  className="stat-value"
                  style={{
                    fontSize: '1rem',
                    wordBreak: 'break-all',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleCopy(link.longUrl)}
                  title="Click to copy"
                >
                  {link.longUrl}
                </div>
              </div>

              {/* Short URL */}
              <div className="stat-card">
                <div className="stat-label">Short URL</div>
                <div
                  className="stat-value"
                  style={{
                    fontSize: '1rem',
                    wordBreak: 'break-all',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleCopy(`${getBaseUrl()}/${link.code}`)}
                  title="Click to copy"
                >
                  {getBaseUrl()}/{link.code}
                </div>
              </div>
            </div>

            <div className="stats-grid">
              {/* Click Count */}
              <div className="stat-card">
                <div className="stat-label">Total Clicks</div>
                <div className="stat-value">{link.clickCount}</div>
              </div>

              {/* Last Clicked */}
              <div className="stat-card">
                <div className="stat-label">Last Clicked</div>
                <div className="stat-value" style={{ fontSize: '1.25rem' }}>
                  {formatTimestamp(link.lastClicked)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => handleCopy(`${getBaseUrl()}/${link.code}`)}
              >
                Copy Short URL
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => window.open(`${getBaseUrl()}/${link.code}`, '_blank')}
              >
                Open Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
