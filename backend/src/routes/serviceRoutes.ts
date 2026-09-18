import { Router } from 'express';
import {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
} from '../controllers/serviceController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getServices);
router.get('/:slug', getServiceBySlug);
router.post('/', authenticateJWT, requireRole('ADMIN'), createService);
router.put('/:id', authenticateJWT, requireRole('ADMIN'), updateService);

export default router;
