require('dotenv').config();
const createApp = require('./app');
const initDatabase = require('./config/initDb');

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await initDatabase();
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ Health check: http://localhost:${PORT}/healthz`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
