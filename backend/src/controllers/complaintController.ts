import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const generateTicketNumber = (): string => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `TKT-${randomNum}`;
};

export const createComplaint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { bookingId, subject, description, priority, againstUserId } = req.body;

    if (!bookingId || !subject || !description) {
      res.status(400).json({ success: false, message: 'Booking ID, subject, and description are required.' });
      return;
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    // Determine target user if not explicitly sent
    const targetAgainstUserId =
      againstUserId ||
      (req.user.id === booking.familyUserId ? booking.caregiverUserId : booking.familyUserId);

    const complaint = await prisma.complaint.create({
      data: {
        ticketNumber: generateTicketNumber(),
        bookingId,
        userId: req.user.id,
        againstUserId: targetAgainstUserId,
        subject: subject.trim(),
        description: description.trim(),
        priority: priority || 'MEDIUM',
        status: 'OPEN',
      },
      include: {
        booking: {
          include: {
            service: true,
            patient: true,
          },
        },
        user: { select: { fullName: true, email: true } },
      },
    });

    // Update booking status to DISPUTED if appropriate
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'DISPUTED' },
    });

    // Notify admins
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: `New Dispute Filed: ${complaint.ticketNumber}`,
          message: `${req.user.fullName} opened a ${complaint.priority} priority complaint for Booking #${booking.bookingNumber}.`,
          type: 'ALERT',
          link: `/admin/complaints`,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Dispute ticket submitted. An ElderCare care coordinator will investigate promptly.',
      data: complaint,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getComplaints = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const whereClause: any = {};

    if (req.user.role !== 'ADMIN') {
      whereClause.OR = [
        { userId: req.user.id },
        { againstUserId: req.user.id },
      ];
    }

    const complaints = await prisma.complaint.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true } },
        againstUser: { select: { id: true, fullName: true, email: true, phone: true } },
        booking: {
          include: {
            service: true,
            patient: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComplaintStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, adminResolution } = req.body;

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: { user: true, booking: true },
    });

    if (!complaint) {
      res.status(404).json({ success: false, message: 'Complaint not found.' });
      return;
    }

    const updated = await prisma.complaint.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminResolution && { adminResolution }),
        ...(status === 'RESOLVED' && { resolvedAt: new Date() }),
      },
      include: { user: true, againstUser: true },
    });

    // Notify complainant
    await prisma.notification.create({
      data: {
        userId: complaint.userId,
        title: `Dispute Update: ${complaint.ticketNumber}`,
        message: `Your complaint has been updated to "${status}". Resolution: ${adminResolution || 'In review'}`,
        type: 'INFO',
        link: `/complaints`,
      },
    });

    res.json({
      success: true,
      message: 'Complaint status and resolution updated.',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
