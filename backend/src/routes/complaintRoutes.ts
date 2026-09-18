import { Router } from 'express';
import {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
} from '../controllers/complaintController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.post('/', createComplaint);
router.get('/', getComplaints);
router.patch('/:id/status', requireRole('ADMIN'), updateComplaintStatus);

export default router;
