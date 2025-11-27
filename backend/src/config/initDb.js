const pool = require('./database');

const initDatabase = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS links (
      id SERIAL PRIMARY KEY,
      code VARCHAR(8) UNIQUE NOT NULL,
      long_url TEXT NOT NULL,
      click_count INTEGER DEFAULT 0,
      last_clicked TIMESTAMP,
      created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'UTC')
    );

    CREATE INDEX IF NOT EXISTS idx_code ON links(code);
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✓ Database tables initialized');
  } catch (error) {
    console.error('✗ Error initializing database:', error);
    throw error;
  }
};

module.exports = initDatabase;
