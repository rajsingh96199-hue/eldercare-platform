import { Router } from 'express';
import { createReview, getReviews } from '../controllers/reviewController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getReviews);
router.post('/', authenticateJWT, requireRole('FAMILY', 'ADMIN'), createReview);

export default router;
