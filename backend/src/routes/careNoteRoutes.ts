import { Router } from 'express';
import {
  createCareNote,
  getCareNotesByPatient,
} from '../controllers/careNoteController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.post('/', requireRole('CAREGIVER', 'ADMIN'), createCareNote);
router.get('/patient/:patientId', getCareNotesByPatient);

export default router;
