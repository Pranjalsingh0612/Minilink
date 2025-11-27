const express = require('express');
const createHealthRoutes = (healthController) => {
  const router = express.Router();

  router.get('/healthz', (req, res) => healthController.healthCheck(req, res));

  return router;
};

module.exports = createHealthRoutes;
