const mongoose = require('mongoose');

class HealthService {
  async getHealthStatus() {
    const dbStateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    const dbState = mongoose.connection.readyState;

    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: dbStateMap[dbState] || 'unknown'
    };
  }
}

module.exports = new HealthService();
