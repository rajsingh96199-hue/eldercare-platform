import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

export const getDashboardAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count();
    const familyUsersCount = await prisma.user.count({ where: { role: 'FAMILY' } });
    const caregiverUsersCount = await prisma.user.count({ where: { role: 'CAREGIVER' } });
    const verifiedCaregiversCount = await prisma.caregiverProfile.count({ where: { isVerified: true } });
    const pendingVerificationsCount = await prisma.caregiverProfile.count({ where: { verificationStatus: 'PENDING' } });

    const totalBookings = await prisma.booking.count();
    const completedBookings = await prisma.booking.count({ where: { status: 'COMPLETED' } });
    const activeBookings = await prisma.booking.count({
      where: { status: { in: ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'] } },
    });
    const disputedBookings = await prisma.booking.count({ where: { status: 'DISPUTED' } });

    // Financial aggregates
    const allBookings = await prisma.booking.findMany({
      select: { totalAmount: true, platformFee: true, caregiverPayout: true, status: true },
    });

    const gmv = allBookings
      .filter((b) => ['COMPLETED', 'IN_PROGRESS', 'ACCEPTED'].includes(b.status))
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const totalPlatformRevenue = allBookings
      .filter((b) => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.platformFee, 0);

    const totalCaregiverPayouts = allBookings
      .filter((b) => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.caregiverPayout, 0);

    const openComplaintsCount = await prisma.complaint.count({ where: { status: 'OPEN' } });

    // Service breakdown
    const services = await prisma.service.findMany({
      include: {
        _count: { select: { bookings: true } },
      },
    });

    // Recent 10 bookings
    const recentBookings = await prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        familyUser: { select: { fullName: true, email: true } },
        caregiverUser: { select: { fullName: true } },
        patient: { select: { fullName: true } },
        service: { select: { title: true } },
      },
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          families: familyUsersCount,
          caregivers: caregiverUsersCount,
          verifiedCaregivers: verifiedCaregiversCount,
          pendingVerifications: pendingVerificationsCount,
        },
        bookings: {
          total: totalBookings,
          completed: completedBookings,
          active: activeBookings,
          disputed: disputedBookings,
        },
        financials: {
          gmv: Math.round(gmv * 100) / 100,
          platformRevenue: Math.round(totalPlatformRevenue * 100) / 100,
          caregiverPayouts: Math.round(totalCaregiverPayouts * 100) / 100,
        },
        complaints: {
          open: openComplaintsCount,
        },
        servicesBreakdown: services.map((s) => ({
          id: s.id,
          title: s.title,
          slug: s.slug,
          bookingsCount: s._count.bookings,
        })),
        recentBookings,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, search, status } = req.query;
    const whereClause: any = {};

    if (role) whereClause.role = String(role);
    if (status === 'active') whereClause.isActive = true;
    if (status === 'inactive') whereClause.isActive = false;

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        caregiverProfile: {
          include: { documents: true },
        },
        _count: {
          select: {
            patients: true,
            bookings: true,
            caregiverBookings: true,
            complaintsFiled: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let filtered = users;
    if (search) {
      const q = String(search).toLowerCase();
      filtered = users.filter((u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q)) ||
        (u.city && u.city.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (user.role === 'ADMIN') {
      res.status(400).json({ success: false, message: 'Cannot deactivate an admin account.' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    res.json({
      success: true,
      message: `User ${updated.isActive ? 'activated' : 'deactivated'} successfully.`,
      user: { id: updated.id, isActive: updated.isActive },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingVerifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const caregivers = await prisma.caregiverProfile.findMany({
      where: {
        OR: [
          { verificationStatus: 'PENDING' },
          { documents: { some: { status: 'PENDING' } } },
        ],
      },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true, avatar: true, city: true } },
        documents: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ success: true, count: caregivers.length, data: caregivers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reviewCaregiverVerification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { caregiverId } = req.params;
    const { status, notes, documentId, documentStatus } = req.body;

    const profile = await prisma.caregiverProfile.findUnique({
      where: { id: caregiverId },
      include: { user: true },
    });

    if (!profile) {
      res.status(404).json({ success: false, message: 'Caregiver profile not found.' });
      return;
    }

    // If specific document is being reviewed
    if (documentId && documentStatus) {
      await prisma.verificationDocument.update({
        where: { id: documentId },
        data: {
          status: documentStatus,
          notes: notes || null,
        },
      });
    }

    const isVerified = status === 'VERIFIED';
    const updated = await prisma.caregiverProfile.update({
      where: { id: caregiverId },
      data: {
        verificationStatus: status || profile.verificationStatus,
        isVerified,
        verificationNotes: notes || null,
      },
      include: { documents: true, user: true },
    });

    // Notify Caregiver
    await prisma.notification.create({
      data: {
        userId: profile.userId,
        title: isVerified ? 'Verification Approved! 🎉' : `Verification Update: ${status}`,
        message: isVerified
          ? 'Congratulations! Your caregiver profile is now verified. You have earned the Verified Healthcare Badge.'
          : `Your verification status was updated to "${status}". Notes: ${notes || 'None'}`,
        type: 'VERIFICATION',
        link: '/caregiver/dashboard',
      },
    });

    res.json({
      success: true,
      message: `Caregiver verification updated to ${status}.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
