class HealthController {
  healthCheck(req, res) {
    const uptime = process.uptime();
    
    return res.status(200).json({
      ok: true,
      version: '1.0',
      uptime: Math.floor(uptime),
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = HealthController;
