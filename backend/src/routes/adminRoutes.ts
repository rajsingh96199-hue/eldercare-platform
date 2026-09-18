import { Router } from 'express';
import {
  getDashboardAnalytics,
  getAllUsers,
  toggleUserStatus,
  getPendingVerifications,
  reviewCaregiverVerification,
} from '../controllers/adminController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT, requireRole('ADMIN'));

router.get('/analytics', getDashboardAnalytics);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/verifications', getPendingVerifications);
router.post('/verifications/:caregiverId/review', reviewCaregiverVerification);

export default router;
