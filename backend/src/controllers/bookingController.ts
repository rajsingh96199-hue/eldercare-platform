import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

// Helper to generate readable booking code
const generateBookingNumber = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `EC-${year}-${randomNum}`;
};

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      caregiverUserId,
      patientId,
      serviceId,
      bookingType,
      startDate,
      endDate,
      startTime,
      endTime,
      totalHours,
      serviceAddress,
      city,
      specialInstructions,
    } = req.body;

    if (!caregiverUserId || !patientId || !serviceId || !startDate || !serviceAddress || !city) {
      res.status(400).json({
        success: false,
        message: 'Caregiver, patient, service, start date, address, and city are required.',
      });
      return;
    }

    // Verify patient belongs to user (or admin)
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient || (patient.familyUserId !== req.user.id && req.user.role !== 'ADMIN')) {
      res.status(403).json({ success: false, message: 'Invalid patient selection.' });
      return;
    }

    // Verify caregiver
    const caregiverProfile = await prisma.caregiverProfile.findUnique({
      where: { userId: caregiverUserId },
      include: { user: true },
    });
    if (!caregiverProfile) {
      res.status(404).json({ success: false, message: 'Caregiver profile not found.' });
      return;
    }

    // Verify service
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }

    const calculatedHours = Number(totalHours) || 4;
    const rate = caregiverProfile.hourlyRate || service.baseHourlyRate;
    const subtotal = calculatedHours * rate;
    const platformFee = Math.round(subtotal * 0.1 * 100) / 100; // 10% platform fee
    const totalAmount = Math.round((subtotal + platformFee) * 100) / 100;
    const caregiverPayout = subtotal;

    const booking = await prisma.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        familyUserId: req.user.id,
        caregiverUserId,
        patientId,
        serviceId,
        bookingType: bookingType || 'HOURLY',
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        startTime: startTime || '09:00 AM',
        endTime: endTime || '01:00 PM',
        totalHours: calculatedHours,
        hourlyRate: rate,
        totalAmount,
        platformFee,
        caregiverPayout,
        status: 'PENDING',
        serviceAddress,
        city,
        specialInstructions: specialInstructions || null,
      },
      include: {
        patient: true,
        service: true,
        caregiverUser: { select: { fullName: true, phone: true, avatar: true } },
      },
    });

    // Notify Caregiver
    await prisma.notification.create({
      data: {
        userId: caregiverUserId,
        title: 'New Booking Request Received',
        message: `You have a new booking request for patient ${patient.fullName} on ${new Date(startDate).toLocaleDateString()}.`,
        type: 'BOOKING',
        link: `/caregiver/bookings/${booking.id}`,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Booking request placed successfully. Waiting for caregiver confirmation.',
      data: booking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { status } = req.query;
    const whereClause: any = {};

    if (status) {
      whereClause.status = String(status);
    }

    if (req.user.role === 'ADMIN') {
      // Admin sees all bookings
    } else if (req.user.role === 'CAREGIVER') {
      whereClause.caregiverUserId = req.user.id;
    } else {
      whereClause.familyUserId = req.user.id;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        patient: true,
        service: true,
        familyUser: {
          select: { id: true, fullName: true, email: true, phone: true, avatar: true },
        },
        caregiverUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatar: true,
            caregiverProfile: { select: { id: true, title: true, ratingAvg: true } },
          },
        },
        careNotes: {
          orderBy: { createdAt: 'desc' },
        },
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ id }, { bookingNumber: id }],
      },
      include: {
        patient: true,
        service: true,
        familyUser: {
          select: { id: true, fullName: true, email: true, phone: true, avatar: true },
        },
        caregiverUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatar: true,
            caregiverProfile: {
              select: {
                id: true,
                title: true,
                ratingAvg: true,
                ratingCount: true,
                yearsExperience: true,
                isVerified: true,
              },
            },
          },
        },
        careNotes: {
          orderBy: { createdAt: 'desc' },
        },
        review: true,
        complaints: true,
      },
    });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    // Permission check
    if (
      req.user?.role !== 'ADMIN' &&
      booking.familyUserId !== req.user?.id &&
      booking.caregiverUserId !== req.user?.id
    ) {
      res.status(403).json({ success: false, message: 'Access forbidden to this booking.' });
      return;
    }

    res.json({ success: true, data: booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { status, reason } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        familyUser: true,
        caregiverUser: { include: { caregiverProfile: true } },
        patient: true,
      },
    });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    const validStatuses = [
      'PENDING',
      'ACCEPTED',
      'ON_THE_WAY',
      'ARRIVED',
      'IN_PROGRESS',
      'COMPLETED',
      'REJECTED',
      'CANCELLED',
      'DISPUTED',
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid booking status.' });
      return;
    }

    // Role-based status transition checks
    if (req.user.role === 'CAREGIVER') {
      if (booking.caregiverUserId !== req.user.id) {
        res.status(403).json({ success: false, message: 'Not authorized for this booking.' });
        return;
      }
      if (!['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'].includes(status)) {
        res.status(400).json({ success: false, message: 'Caregiver cannot set this status.' });
        return;
      }
    } else if (req.user.role === 'FAMILY') {
      if (booking.familyUserId !== req.user.id) {
        res.status(403).json({ success: false, message: 'Not authorized for this booking.' });
        return;
      }
      if (!['CANCELLED', 'DISPUTED'].includes(status)) {
        res.status(400).json({ success: false, message: 'User can only cancel or dispute a booking.' });
        return;
      }
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status,
        ...(status === 'CANCELLED' && { cancellationReason: reason || 'Cancelled by user' }),
        ...(status === 'REJECTED' && { rejectionReason: reason || 'Caregiver unavailable' }),
      },
      include: {
        patient: true,
        service: true,
        caregiverUser: { select: { fullName: true, phone: true } },
      },
    });

    // If completed, update caregiver's total completed hours
    if (status === 'COMPLETED' && booking.caregiverUser.caregiverProfile) {
      await prisma.caregiverProfile.update({
        where: { id: booking.caregiverUser.caregiverProfile.id },
        data: {
          totalHoursCompleted: {
            increment: booking.totalHours,
          },
        },
      });
    }

    // Send notifications
    const targetUserId = req.user.id === booking.familyUserId ? booking.caregiverUserId : booking.familyUserId;
    const statusLabels: Record<string, string> = {
      ACCEPTED: 'Caregiver Accepted Booking',
      ON_THE_WAY: 'Caregiver is On The Way',
      ARRIVED: 'Caregiver has Arrived at Destination',
      IN_PROGRESS: 'Care Session is In Progress',
      COMPLETED: 'Care Session Completed',
      REJECTED: 'Booking Request Declined',
      CANCELLED: 'Booking Was Cancelled',
      DISPUTED: 'Booking Disputed',
    };

    await prisma.notification.create({
      data: {
        userId: targetUserId,
        title: statusLabels[status] || `Booking Status Updated: ${status}`,
        message: `Booking #${booking.bookingNumber} for ${booking.patient.fullName} has been updated to "${status}".`,
        type: 'BOOKING',
        link: `/bookings/${booking.id}`,
      },
    });

    res.json({
      success: true,
      message: `Booking updated to ${status}.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
