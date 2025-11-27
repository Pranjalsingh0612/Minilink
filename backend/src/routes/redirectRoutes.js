const express = require('express');
const createRedirectRoutes = (linkController) => {
  const router = express.Router();

  router.get('/:code', (req, res) => linkController.redirect(req, res));

  return router;
};

module.exports = createRedirectRoutes;
