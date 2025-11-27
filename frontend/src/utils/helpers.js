export const validateUrl = (url) => {
  if (!url || !url.trim()) {
    return 'URL is required';
  }

  if (url.length > 2048) {
    return 'URL is too long (max 2048 characters)';
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'URL must start with http:// or https://';
  }

  try {
    new URL(url);
    return null;
  } catch (error) {
    return 'Invalid URL format';
  }
};

export const validateCode = (code) => {
  if (!code || !code.trim()) {
    return null; // Code is optional
  }

  const trimmedCode = code.trim();
  const codePattern = /^[A-Za-z0-9]{6,8}$/;

  if (!codePattern.test(trimmedCode)) {
    return 'Code must be 6-8 alphanumeric characters (A-Z, a-z, 0-9)';
  }

  return null;
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return 'Never';
  }

  const date = new Date(timestamp);
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
  const istDate = new Date(date.getTime() + istOffset);
  
  const day = istDate.getUTCDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[istDate.getUTCMonth()];
  const year = istDate.getUTCFullYear();
  
  let hours = istDate.getUTCHours();
  const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(istDate.getUTCSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  
  return `${day} ${month} ${year}, ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

export const copyToClipboard = async (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
};
