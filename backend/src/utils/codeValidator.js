const isValidCode = (code) => {
  if (!code || typeof code !== 'string') {
    return false;
  }

  const codePattern = /^[A-Za-z0-9]{6,8}$/;
  return codePattern.test(code);
};

module.exports = { isValidCode };
