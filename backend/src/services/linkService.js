const { isValidUrl } = require('../utils/urlValidator');
const { isValidCode } = require('../utils/codeValidator');
const { generateCode } = require('../utils/codeGenerator');

class LinkService {
  constructor(linkRepository) {
    this.linkRepository = linkRepository;
  }

  async createLink(longUrl, customCode = null) {
    if (!isValidUrl(longUrl)) {
      const error = new Error('Invalid URL format. Must start with http:// or https://');
      error.statusCode = 400;
      throw error;
    }

    let code = customCode;

    if (customCode) {
      if (!isValidCode(customCode)) {
        const error = new Error('Invalid code format. Must be 6-8 alphanumeric characters [A-Za-z0-9]');
        error.statusCode = 400;
        throw error;
      }

      const existingLink = await this.linkRepository.findByCode(customCode);
      if (existingLink) {
        if (existingLink.longUrl === longUrl) {
          return { link: existingLink, existed: true };
        }
        const error = new Error('Custom code already exists with different URL');
        error.statusCode = 409;
        throw error;
      }
    } else {
      code = await this._generateUniqueCode();
    }

    const link = await this.linkRepository.create(code, longUrl);
    return { link, existed: false };
  }

  async getAllLinks() {
    return await this.linkRepository.findAll();
  }

  async getLinkStats(code) {
    const link = await this.linkRepository.findByCode(code);
    
    if (!link) {
      const error = new Error('Link not found');
      error.statusCode = 404;
      throw error;
    }

    return link;
  }

  async redirectAndTrack(code) {
    const link = await this.linkRepository.incrementClickCount(code);
    
    if (!link) {
      const error = new Error('Link not found');
      error.statusCode = 404;
      throw error;
    }

    return link.longUrl;
  }

  async deleteLink(code) {
    const deleted = await this.linkRepository.deleteByCode(code);
    
    if (!deleted) {
      const error = new Error('Link not found');
      error.statusCode = 404;
      throw error;
    }

    return true;
  }

  async _generateUniqueCode() {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const code = generateCode();
      const exists = await this.linkRepository.exists(code);
      
      if (!exists) {
        return code;
      }
      
      attempts++;
    }

    throw new Error('Failed to generate unique code. Please try again.');
  }
}

module.exports = LinkService;
