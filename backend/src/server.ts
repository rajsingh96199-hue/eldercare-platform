import app from './app';
import { config } from './config';
import prisma from './lib/prisma';

const startServer = async () => {
  try {
    // Verify DB connectivity
    await prisma.$connect();
    console.log('✅ Connected to database successfully.');

    app.listen(config.port, () => {
      console.log(`🚀 ElderCare API Server running on port ${config.port} [${config.nodeEnv}]`);
      console.log(`📡 Health endpoint: http://localhost:${config.port}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
