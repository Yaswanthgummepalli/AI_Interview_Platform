const dashboardService = require('../services/dashboard.service');
const ApiResponse = require('../utils/ApiResponse');

const getUserDashboard = async (req, res, next) => {
  try {
    const dashboardData = await dashboardService.getUserDashboard(req.user._id);
    return res
      .status(200)
      .json(new ApiResponse(200, dashboardData, 'User dashboard retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const getAdminDashboard = async (req, res, next) => {
  try {
    const dashboardData = await dashboardService.getAdminDashboard();
    return res
      .status(200)
      .json(new ApiResponse(200, dashboardData, 'Admin dashboard retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserDashboard,
  getAdminDashboard
};
