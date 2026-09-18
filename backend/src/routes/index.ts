import { Router } from 'express';
import authRoutes from './authRoutes';
import patientRoutes from './patientRoutes';
import caregiverRoutes from './caregiverRoutes';
import serviceRoutes from './serviceRoutes';
import bookingRoutes from './bookingRoutes';
import careNoteRoutes from './careNoteRoutes';
import reviewRoutes from './reviewRoutes';
import complaintRoutes from './complaintRoutes';
import notificationRoutes from './notificationRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ElderCare API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    emergencyDisclaimer: 'ElderCare is not an emergency medical service. In case of life-threatening emergency, call 911 or local emergency services immediately.',
  });
});

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/caregivers', caregiverRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/care-notes', careNoteRoutes);
router.use('/reviews', reviewRoutes);
router.use('/complaints', complaintRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

export default router;
