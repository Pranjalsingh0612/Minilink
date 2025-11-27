 class LinkController { 
  constructor(linkService) {
    this.linkService = linkService;
  }
 
  async createLink(req, res) {
    try {
      const { longUrl, customCode } = req.body;
 
      if (!longUrl) {
        return res.status(400).json({
          error: 'longUrl is required'
        });
      } 
      const result = await this.linkService.createLink(longUrl, customCode || null);
      const link = result.link;
 
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const shortUrl = `${baseUrl}/${link.code}`;
 
      const statusCode = 200;
 
      return res.status(statusCode).json({
        code: link.code,
        longUrl: link.longUrl,
        shortUrl: shortUrl,
        createdAt: link.createdAt,
        existed: result.existed
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        error: error.message
      });
    }
  }
 
  async getAllLinks(req, res) {
    try {
      const links = await this.linkService.getAllLinks();
 
      const response = links.map(link => ({
        code: link.code,
        longUrl: link.longUrl,
        clickCount: link.clickCount,
        lastClicked: link.lastClicked,
        createdAt: link.createdAt
      }));

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        error: error.message
      });
    }
  }
 
  async getLinkStats(req, res) {
    try {
      const { code } = req.params;

      const link = await this.linkService.getLinkStats(code);

      return res.status(200).json({
        code: link.code,
        longUrl: link.longUrl,
        clickCount: link.clickCount,
        lastClicked: link.lastClicked
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        error: error.message
      });
    }
  }
 
  async redirect(req, res) {
    try {
      const { code } = req.params;
 
      const longUrl = await this.linkService.redirectAndTrack(code);
 
      return res.redirect(302, longUrl);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        error: error.message
      });
    }
  }
 
  async deleteLink(req, res) {
    try {
      const { code } = req.params;

      await this.linkService.deleteLink(code); 
      return res.status(204).send();
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        error: error.message
      });
    }
  }
}

module.exports = LinkController;
