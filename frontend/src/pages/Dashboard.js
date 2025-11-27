
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLinks, createLink, deleteLink, getBaseUrl } from '../services/api';
import { validateUrl, validateCode, formatTimestamp, truncateText, copyToClipboard } from '../utils/helpers';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  
  const [listError, setListError] = useState(null);
  const [listSuccess, setListSuccess] = useState(null);
  
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [urlError, setUrlError] = useState(null);
  const [codeError, setCodeError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    filterLinks();
  }, [searchTerm, links]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setListError(null);
      const data = await getAllLinks();
      setLinks(data);
    } catch (err) {
      setListError('Failed to load links. Please try again.');
      console.error('Error fetching links:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterLinks = () => {
    if (!searchTerm.trim()) {
      setFilteredLinks(links);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = links.filter(
      (link) =>
        link.code.toLowerCase().includes(term) ||
        link.longUrl.toLowerCase().includes(term)
    );
    setFilteredLinks(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setFormError(null);
    setFormSuccess(null);
    setUrlError(null);
    setCodeError(null);

    const urlValidation = validateUrl(longUrl);
    const codeValidation = validateCode(customCode);

    if (urlValidation) {
      setUrlError(urlValidation);
      return;
    }

    if (codeValidation) {
      setCodeError(codeValidation);
      return;
    }

    // Submit form
    try {
      setSubmitting(true);
      const result = await createLink(longUrl, customCode || null);
      
      if (result.existed) {
        setFormSuccess('Link & Custom Code exists as a pair');
      } else {
        setFormSuccess(`Short link created: ${result.shortUrl}`);
      }
      
      setLongUrl('');
      setCustomCode('');
      
      await fetchLinks();
      
      setTimeout(() => setFormSuccess(null), 5000);
    } catch (err) {
      if (err.statusCode === 409) {
        setFormError('Custom code already exists with different URL');
        setCustomCode('');
      } else {
        setFormError(err.message || 'Failed to create link. Please try again.');
      }
      console.error('Error creating link:', err);
      
      setTimeout(() => setFormError(null), 5000);
    } finally {
      setSubmitting(false);
    }
  };

 
  const handleDelete = async (code) => {
    if (!window.confirm(`Are you sure you want to delete the link "${code}"?`)) {
      return;
    }

    try {
      setListError(null);
      await deleteLink(code);
      setListSuccess(`Link "${code}" deleted successfully`);
      
      // Refresh links
      await fetchLinks();
      
      // Clear success message after 3 seconds
      setTimeout(() => setListSuccess(null), 3000);
    } catch (err) {
      setListError(err.message || 'Failed to delete link. Please try again.');
      console.error('Error deleting link:', err);
    }
  };


  const handleCopy = async (shortUrl) => {
    try {
      await copyToClipboard(shortUrl);
      setListSuccess('Short URL copied to clipboard!');
      setTimeout(() => setListSuccess(null), 2000);
    } catch (err) {
      setListError('Failed to copy to clipboard');
      setTimeout(() => setListError(null), 2000);
    }
  };

  /**
   * Navigate to stats page
   */
  const handleViewStats = (code) => {
    navigate(`/code/${code}`);
  };

  return (
    <div className="container">
      {/* Add Link Form */}
      <div className="card">
        <h2>Create Short Link</h2>
        
        {formError && <div className="error-message">{formError}</div>}
        {formSuccess && <div className="success-message">{formSuccess}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="longUrl" className="form-label">
              Long URL *
            </label>
            <input
              type="text"
              id="longUrl"
              className={`form-input ${urlError ? 'error' : ''}`}
              placeholder="https://example.com/very/long/url"
              value={longUrl}
              onChange={(e) => {
                setLongUrl(e.target.value);
                setUrlError(null);
              }}
              disabled={submitting}
            />
            {urlError && <div className="form-error">{urlError}</div>}
            {!urlError && (
              <div className="form-hint">Enter the URL you want to shorten</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="customCode" className="form-label">
              Custom Code (Optional)
            </label>
            <input
              type="text"
              id="customCode"
              className={`form-input ${codeError ? 'error' : ''}`}
              placeholder="myLink1 (6-8 alphanumeric)"
              value={customCode}
              onChange={(e) => {
                setCustomCode(e.target.value);
                setCodeError(null);
              }}
              disabled={submitting}
            />
            {codeError && <div className="form-error">{codeError}</div>}
            {!codeError && (
              <div className="form-hint">
                6-8 alphanumeric characters (A-Z, a-z, 0-9). Leave empty for auto-generated code.
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create Short Link'}
          </button>
        </form>
      </div>

      {/* Search/Filter */}
      <div className="card">
        <h2>All Links</h2>
        
        {listError && <div className="error-message">{listError}</div>}
        {listSuccess && <div className="success-message">{listSuccess}</div>}
        
        <div className="search-box">
          <input
            type="text"
            className="form-input"
            placeholder="Search by code or URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading State */}
        {loading && <Loading message="Loading links..." />}

        {/* Empty State */}
        {!loading && !listError && filteredLinks.length === 0 && !searchTerm && (
          <EmptyState
            icon=""
            message="No links yet. Create your first short link above!"
          />
        )}

        {/* No Search Results */}
        {!loading && !listError && filteredLinks.length === 0 && searchTerm && (
          <EmptyState
            icon=""
            message={`No links found matching "${searchTerm}"`}
          />
        )}

        {/* Links Table */}
        {!loading && filteredLinks.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Long URL</th>
                  <th>Clicks</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.map((link) => {
                  const shortUrl = `${getBaseUrl()}/${link.code}`;
                  const redirectUrl = `${getBaseUrl()}/${link.code}`;
                  return (
                    <tr key={link.code}>
                      <td>
                        <a
                          href={redirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="code"
                          style={{ cursor: 'pointer', textDecoration: 'none' }}
                        >
                          {link.code}
                        </a>
                      </td>
                      <td title={link.longUrl}>
                        {truncateText(link.longUrl, 50)}
                      </td>
                      <td>{link.clickCount}</td>
                      <td>{formatTimestamp(link.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() => handleCopy(shortUrl)}
                          >
                            Copy
                          </button>
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() => handleViewStats(link.code)}
                          >
                            Stats
                          </button>
                          <button
                            className="btn btn-danger btn-small"
                            onClick={() => handleDelete(link.code)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
