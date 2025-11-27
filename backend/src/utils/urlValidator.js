const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  if (url.length > 2048) {
    return false;
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { isValidUrl };
