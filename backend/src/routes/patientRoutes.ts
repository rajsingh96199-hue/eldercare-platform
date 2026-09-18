import { Router } from 'express';
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from '../controllers/patientController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getPatients);
router.get('/:id', getPatientById);
router.post('/', requireRole('FAMILY', 'ADMIN'), createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;
