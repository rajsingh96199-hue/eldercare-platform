import { Router } from 'express';
import {
  getCaregivers,
  getCaregiverById,
  updateMyCaregiverProfile,
  uploadDocument,
  getCaregiverStats,
} from '../controllers/caregiverController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

// Public routes for browsing
router.get('/', getCaregivers);
router.get('/:id', getCaregiverById);

// Protected caregiver routes
router.put('/me/profile', authenticateJWT, requireRole('CAREGIVER'), updateMyCaregiverProfile);
router.post('/me/documents', authenticateJWT, requireRole('CAREGIVER'), uploadDocument);
router.get('/me/stats', authenticateJWT, requireRole('CAREGIVER'), getCaregiverStats);

export default router;
