import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

export const createCareNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      bookingId,
      bloodPressure,
      bloodSugar,
      pulseRate,
      temperature,
      oxygenLevel,
      medicationsAdministered,
      dietNotes,
      mobilityExercises,
      moodState,
      notes,
    } = req.body;

    if (!bookingId || !notes) {
      res.status(400).json({ success: false, message: 'Booking ID and clinical notes are required.' });
      return;
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        caregiverUser: { include: { caregiverProfile: true } },
        patient: true,
      },
    });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    if (req.user.role === 'CAREGIVER' && booking.caregiverUserId !== req.user.id) {
      res.status(403).json({ success: false, message: 'Not authorized to log care notes for this booking.' });
      return;
    }

    const caregiverProfileId = booking.caregiverUser.caregiverProfile?.id;
    if (!caregiverProfileId) {
      res.status(400).json({ success: false, message: 'Caregiver profile not found.' });
      return;
    }

    const careNote = await prisma.careNote.create({
      data: {
        bookingId,
        caregiverProfileId,
        patientId: booking.patientId,
        bloodPressure: bloodPressure || null,
        bloodSugar: bloodSugar || null,
        pulseRate: pulseRate ? Number(pulseRate) : null,
        temperature: temperature ? Number(temperature) : null,
        oxygenLevel: oxygenLevel ? Number(oxygenLevel) : null,
        medicationsAdministered: medicationsAdministered || null,
        dietNotes: dietNotes || null,
        mobilityExercises: mobilityExercises || null,
        moodState: moodState || 'Calm',
        notes: notes.trim(),
      },
      include: {
        patient: true,
        caregiverProfile: {
          include: { user: { select: { fullName: true } } },
        },
      },
    });

    // Notify Family
    await prisma.notification.create({
      data: {
        userId: booking.familyUserId,
        title: 'New Daily Care Note & Vitals Recorded',
        message: `${booking.caregiverUser.fullName} logged care notes & vitals for ${booking.patient.fullName}.`,
        type: 'CARE_NOTE',
        link: `/patients/${booking.patientId}`,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Care note and vitals logged successfully.',
      data: careNote,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCareNotesByPatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      res.status(404).json({ success: false, message: 'Patient not found.' });
      return;
    }

    if (
      req.user?.role !== 'ADMIN' &&
      patient.familyUserId !== req.user?.id
    ) {
      // check if caregiver has bookings with this patient
      const hasBooking = await prisma.booking.findFirst({
        where: { patientId, caregiverUserId: req.user?.id },
      });
      if (!hasBooking) {
        res.status(403).json({ success: false, message: 'Forbidden.' });
        return;
      }
    }

    const careNotes = await prisma.careNote.findMany({
      where: { patientId },
      include: {
        caregiverProfile: {
          include: {
            user: { select: { id: true, fullName: true, avatar: true } },
          },
        },
        booking: {
          select: { bookingNumber: true, service: { select: { title: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: careNotes.length, data: careNotes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
