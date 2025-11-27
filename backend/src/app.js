const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const createHealthRoutes = require('./routes/healthRoutes');
const createLinkRoutes = require('./routes/linkRoutes');
const createRedirectRoutes = require('./routes/redirectRoutes');
const HealthController = require('./controllers/healthController');
const LinkController = require('./controllers/linkController');
const LinkService = require('./services/linkService');
const LinkRepository = require('./repositories/linkRepository');
const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Disable caching for API responses (useful during development)
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
  });

  // Request logging middleware (development)
  if (process.env.NODE_ENV !== 'test') {
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
  }

  const linkRepository = new LinkRepository();
  const linkService = new LinkService(linkRepository);
  const linkController = new LinkController(linkService);
  const healthController = new HealthController();

  // Register routes
  app.use(createHealthRoutes(healthController));
  app.use(createLinkRoutes(linkController));
  app.use(createRedirectRoutes(linkController));

  app.use(errorHandler);
  return app;
};

module.exports = createApp;
