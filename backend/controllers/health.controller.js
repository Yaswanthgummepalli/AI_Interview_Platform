const healthService = require('../services/health.service');

const getHealthStatus = async (req, res, next) => {
  try {
    const healthDetails = await healthService.getHealthStatus();
    
    return res.status(200).json({
      success: true,
      message: 'InterviewAI API is running',
      details: healthDetails
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHealthStatus
};
