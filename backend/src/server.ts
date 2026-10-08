import app from './app';
import { config } from './config';
import prisma from './lib/prisma';
import { ensureDefaultData } from './utils/autoSeed';

const startServer = async () => {
  try {
    // Verify DB connectivity
    await prisma.$connect();
    console.log('✅ Connected to database successfully.');

    // Auto-seed demo accounts if fresh database
    await ensureDefaultData();

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
