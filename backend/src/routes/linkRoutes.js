const express = require('express');
const createLinkRoutes = (linkController) => {
  const router = express.Router();

  router.post('/api/links', (req, res) => linkController.createLink(req, res));
  router.get('/api/links', (req, res) => linkController.getAllLinks(req, res));
  router.get('/api/links/:code', (req, res) => linkController.getLinkStats(req, res));
  router.delete('/api/links/:code', (req, res) => linkController.deleteLink(req, res));

  return router;
};

module.exports = createLinkRoutes;
