const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

/**
 * Fetch all links
 * @returns {Promise<Array>} - Array of link objects
 */
export const getAllLinks = async () => {
  const response = await fetch(`${API_URL}/api/links`);
  if (!response.ok) {
    throw new Error('Failed to fetch links');
  }
  return response.json();
};

export const createLink = async (longUrl, customCode = null) => {
  const body = { longUrl };
  if (customCode && customCode.trim()) {
    body.customCode = customCode.trim();
  }

  const response = await fetch(`${API_URL}/api/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || 'Failed to create link');
    error.statusCode = response.status;
    throw error;
  }

  return data;
};

export const getLinkStats = async (code) => {
  const response = await fetch(`${API_URL}/api/links/${code}`);
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch link stats');
  }

  return data;
};

export const deleteLink = async (code) => {
  const response = await fetch(`${API_URL}/api/links/${code}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete link');
  }
};

export const getHealthStatus = async () => {
  const response = await fetch(`${API_URL}/healthz`);
  
  if (!response.ok) {
    throw new Error('Health check failed');
  }

  return response.json();
};

export const getBaseUrl = () => {
  return API_URL;
};
