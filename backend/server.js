require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      console.log(`[InterviewAI Server] Running on http://localhost:${PORT}`);
      console.log(`[InterviewAI Server] Health Check: http://localhost:${PORT}/api/health`);
    });

    // Handle server error events (e.g. port already in use)
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n❌ [Server Error] Port ${PORT} is already in use.`);
        console.error(`💡 Solution:`);
        console.error(`   1. Stop any background Node.js process using port ${PORT}`);
        console.error(`   2. Or run: npx kill-port ${PORT}`);
        console.error(`   3. Or change PORT in your backend/.env file (e.g., PORT=5001)\n`);
        process.exit(1);
      } else {
        console.error(`❌ [Server Error] ${error.message}`);
        process.exit(1);
      }
    });

    // Graceful shutdown on process termination
    const gracefulShutdown = (signal) => {
      console.log(`\n[Server] Received ${signal}. Closing HTTP server...`);
      server.close(() => {
        console.log('[Server] HTTP server closed cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (error) {
    console.error(`❌ [Server Start Error] ${error.message}`);
    process.exit(1);
  }
};

startServer();
