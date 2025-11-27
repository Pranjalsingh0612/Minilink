const pool = require('../config/database');

class LinkRepository {
  async create(code, longUrl) {
    const query = `
      INSERT INTO links (code, long_url)
      VALUES ($1, $2)
      RETURNING id, code, long_url, click_count, last_clicked, created_at
    `;
    
    const result = await pool.query(query, [code, longUrl]);
    return this._mapToLink(result.rows[0]);
  }

  async findByCode(code) {
    const query = `
      SELECT id, code, long_url, click_count, last_clicked, created_at
      FROM links
      WHERE code = $1
    `;
    
    const result = await pool.query(query, [code]);
    return result.rows.length > 0 ? this._mapToLink(result.rows[0]) : null;
  }

  async findAll() {
    const query = `
      SELECT id, code, long_url, click_count, last_clicked, created_at
      FROM links
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    return result.rows.map(row => this._mapToLink(row));
  }

  async incrementClickCount(code) {
    const query = `
      UPDATE links
      SET click_count = click_count + 1,
          last_clicked = NOW() AT TIME ZONE 'UTC'
      WHERE code = $1
      RETURNING id, code, long_url, click_count, last_clicked, created_at
    `;
    
    const result = await pool.query(query, [code]);
    return result.rows.length > 0 ? this._mapToLink(result.rows[0]) : null;
  }

  async deleteByCode(code) {
    const query = `
      DELETE FROM links
      WHERE code = $1
      RETURNING id
    `;
    
    const result = await pool.query(query, [code]);
    return result.rowCount > 0;
  }

  async exists(code) {
    const query = `
      SELECT 1 FROM links WHERE code = $1
    `;
    
    const result = await pool.query(query, [code]);
    return result.rows.length > 0;
  }

  _mapToLink(row) {
    return {
      id: row.id,
      code: row.code,
      longUrl: row.long_url,
      clickCount: row.click_count,
      lastClicked: row.last_clicked ? this._formatTimestamp(row.last_clicked) : null,
      createdAt: this._formatTimestamp(row.created_at)
    };
  }

  _formatTimestamp(timestamp) {
    if (!timestamp) return null;
    const isoString = timestamp.replace(' ', 'T').substring(0, 23) + 'Z';
    return isoString;
  }
}

module.exports = LinkRepository;
