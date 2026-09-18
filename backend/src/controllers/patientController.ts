import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

export const getPatients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    let patients;
    if (req.user.role === 'ADMIN') {
      patients = await prisma.patient.findMany({
        include: {
          familyUser: {
            select: { id: true, fullName: true, email: true, phone: true },
          },
          _count: { select: { bookings: true, careNotes: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (req.user.role === 'CAREGIVER') {
      // Caregivers can view patients they have active/accepted/completed bookings with
      const caregiverBookings = await prisma.booking.findMany({
        where: { caregiverUserId: req.user.id },
        select: { patientId: true },
      });
      const patientIds = Array.from(new Set(caregiverBookings.map((b) => b.patientId)));

      patients = await prisma.patient.findMany({
        where: { id: { in: patientIds } },
        include: {
          familyUser: {
            select: { id: true, fullName: true, email: true, phone: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });
    } else {
      // Family role
      patients = await prisma.patient.findMany({
        where: { familyUserId: req.user.id },
        include: {
          _count: { select: { bookings: true, careNotes: true } },
          careNotes: {
            take: 3,
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    res.json({ success: true, count: patients.length, data: patients });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        familyUser: {
          select: { id: true, fullName: true, email: true, phone: true, city: true },
        },
        careNotes: {
          include: {
            caregiverProfile: {
              include: {
                user: { select: { fullName: true, avatar: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        bookings: {
          include: {
            service: true,
            caregiverUser: { select: { id: true, fullName: true, avatar: true } },
          },
          orderBy: { startDate: 'desc' },
        },
      },
    });

    if (!patient) {
      res.status(404).json({ success: false, message: 'Patient profile not found.' });
      return;
    }

    // Access check: Owner family user, assigned caregiver, or admin
    if (
      req.user?.role !== 'ADMIN' &&
      patient.familyUserId !== req.user?.id
    ) {
      const isAssignedCaregiver = patient.bookings.some(
        (b) => b.caregiverUserId === req.user?.id
      );
      if (!isAssignedCaregiver) {
        res.status(403).json({ success: false, message: 'Forbidden. No access to patient health data.' });
        return;
      }
    }

    res.json({ success: true, data: patient });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      fullName,
      age,
      gender,
      relationship,
      medicalConditions,
      allergies,
      mobilityLevel,
      dietaryNeeds,
      emergencyContactName,
      emergencyContactPhone,
      doctorName,
      doctorPhone,
      notes,
    } = req.body;

    if (!fullName || !age || !gender || !relationship) {
      res.status(400).json({
        success: false,
        message: 'Full name, age, gender, and relationship are required fields.',
      });
      return;
    }

    const patient = await prisma.patient.create({
      data: {
        familyUserId: req.user.id,
        fullName: fullName.trim(),
        age: Number(age),
        gender,
        relationship: relationship.trim(),
        medicalConditions: medicalConditions || null,
        allergies: allergies || null,
        mobilityLevel: mobilityLevel || 'Independent',
        dietaryNeeds: dietaryNeeds || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
        doctorName: doctorName || null,
        doctorPhone: doctorPhone || null,
        notes: notes || null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Elderly patient profile created successfully.',
      data: patient,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.patient.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Patient not found.' });
      return;
    }

    if (req.user?.role !== 'ADMIN' && existing.familyUserId !== req.user?.id) {
      res.status(403).json({ success: false, message: 'Access denied.' });
      return;
    }

    const {
      fullName,
      age,
      gender,
      relationship,
      medicalConditions,
      allergies,
      mobilityLevel,
      dietaryNeeds,
      emergencyContactName,
      emergencyContactPhone,
      doctorName,
      doctorPhone,
      notes,
    } = req.body;

    const updated = await prisma.patient.update({
      where: { id },
      data: {
        ...(fullName && { fullName: fullName.trim() }),
        ...(age !== undefined && { age: Number(age) }),
        ...(gender && { gender }),
        ...(relationship && { relationship: relationship.trim() }),
        ...(medicalConditions !== undefined && { medicalConditions }),
        ...(allergies !== undefined && { allergies }),
        ...(mobilityLevel && { mobilityLevel }),
        ...(dietaryNeeds !== undefined && { dietaryNeeds }),
        ...(emergencyContactName !== undefined && { emergencyContactName }),
        ...(emergencyContactPhone !== undefined && { emergencyContactPhone }),
        ...(doctorName !== undefined && { doctorName }),
        ...(doctorPhone !== undefined && { doctorPhone }),
        ...(notes !== undefined && { notes }),
      },
    });

    res.json({
      success: true,
      message: 'Patient details updated.',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.patient.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Patient not found.' });
      return;
    }

    if (req.user?.role !== 'ADMIN' && existing.familyUserId !== req.user?.id) {
      res.status(403).json({ success: false, message: 'Access denied.' });
      return;
    }

    await prisma.patient.delete({ where: { id } });

    res.json({ success: true, message: 'Patient profile removed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
