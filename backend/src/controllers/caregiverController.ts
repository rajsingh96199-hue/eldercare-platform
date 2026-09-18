import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

export const getCaregivers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      service,
      city,
      minRating,
      maxPrice,
      minExperience,
      isVerified,
      search,
    } = req.query;

    const whereClause: any = {};

    if (isVerified === 'true') {
      whereClause.isVerified = true;
    }

    if (minRating) {
      whereClause.ratingAvg = { gte: Number(minRating) };
    }

    if (maxPrice) {
      whereClause.hourlyRate = { lte: Number(maxPrice) };
    }

    if (minExperience) {
      whereClause.yearsExperience = { gte: Number(minExperience) };
    }

    if (city) {
      whereClause.serviceAreas = {
        contains: String(city),
      };
    }

    if (service) {
      whereClause.specializations = {
        contains: String(service),
      };
    }

    const caregivers = await prisma.caregiverProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatar: true,
            city: true,
            address: true,
          },
        },
        documents: {
          select: { id: true, type: true, name: true, status: true },
        },
        _count: {
          select: { reviewsReceived: true },
        },
      },
      orderBy: [{ isVerified: 'desc' }, { ratingAvg: 'desc' }],
    });

    // In-memory text search fallback for comprehensive fuzzy matching
    let filtered = caregivers;
    if (search) {
      const q = String(search).toLowerCase();
      filtered = caregivers.filter((c) =>
        c.user.fullName.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.bio.toLowerCase().includes(q) ||
        c.specializations.toLowerCase().includes(q) ||
        c.qualifications.toLowerCase().includes(q) ||
        (c.user.city && c.user.city.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCaregiverById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const caregiver = await prisma.caregiverProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatar: true,
            city: true,
            address: true,
            createdAt: true,
          },
        },
        documents: true,
        reviewsReceived: {
          include: {
            user: { select: { fullName: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!caregiver) {
      res.status(404).json({ success: false, message: 'Caregiver profile not found.' });
      return;
    }

    res.json({ success: true, data: caregiver });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMyCaregiverProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'CAREGIVER') {
      res.status(403).json({ success: false, message: 'Caregiver role required.' });
      return;
    }

    const {
      title,
      bio,
      yearsExperience,
      hourlyRate,
      dailyRate,
      qualifications,
      specializations,
      serviceAreas,
      languages,
      isAvailable,
    } = req.body;

    const profile = await prisma.caregiverProfile.upsert({
      where: { userId: req.user.id },
      update: {
        ...(title && { title: title.trim() }),
        ...(bio && { bio }),
        ...(yearsExperience !== undefined && { yearsExperience: Number(yearsExperience) }),
        ...(hourlyRate !== undefined && { hourlyRate: Number(hourlyRate) }),
        ...(dailyRate !== undefined && { dailyRate: Number(dailyRate) }),
        ...(qualifications && {
          qualifications: typeof qualifications === 'string' ? qualifications : JSON.stringify(qualifications),
        }),
        ...(specializations && {
          specializations: typeof specializations === 'string' ? specializations : JSON.stringify(specializations),
        }),
        ...(serviceAreas && {
          serviceAreas: typeof serviceAreas === 'string' ? serviceAreas : JSON.stringify(serviceAreas),
        }),
        ...(languages && { languages }),
        ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) }),
      },
      create: {
        userId: req.user.id,
        title: title || 'Professional Healthcare Assistant',
        bio: bio || 'Dedicated caregiver providing personalized, compassionate care.',
        yearsExperience: Number(yearsExperience) || 1,
        hourlyRate: Number(hourlyRate) || 25,
        dailyRate: Number(dailyRate) || 180,
        qualifications: typeof qualifications === 'string' ? qualifications : JSON.stringify(qualifications || ['Licensed Nurse']),
        specializations: typeof specializations === 'string' ? specializations : JSON.stringify(specializations || ['Elderly Care']),
        serviceAreas: typeof serviceAreas === 'string' ? serviceAreas : JSON.stringify(serviceAreas || ['City Center']),
        languages: languages || 'English',
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      },
      include: { documents: true },
    });

    res.json({
      success: true,
      message: 'Caregiver profile updated successfully.',
      data: profile,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'CAREGIVER') {
      res.status(403).json({ success: false, message: 'Caregiver role required.' });
      return;
    }

    const { type, name, fileUrl, notes } = req.body;

    if (!type || !name) {
      res.status(400).json({ success: false, message: 'Document type and name are required.' });
      return;
    }

    const profile = await prisma.caregiverProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      res.status(404).json({ success: false, message: 'Caregiver profile not found.' });
      return;
    }

    const document = await prisma.verificationDocument.create({
      data: {
        caregiverId: profile.id,
        type,
        name,
        fileUrl: fileUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
        status: 'PENDING',
        notes: notes || null,
      },
    });

    // Reset profile verification status to PENDING for admin review
    await prisma.caregiverProfile.update({
      where: { id: profile.id },
      data: { verificationStatus: 'PENDING' },
    });

    // Create notification for admin
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: 'New Caregiver Document Submitted',
          message: `${req.user.fullName} uploaded ${name} for verification.`,
          type: 'VERIFICATION',
          link: '/admin/verifications',
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Document submitted for verification review.',
      data: document,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCaregiverStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'CAREGIVER') {
      res.status(403).json({ success: false, message: 'Caregiver role required.' });
      return;
    }

    const profile = await prisma.caregiverProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      res.status(404).json({ success: false, message: 'Caregiver profile not found.' });
      return;
    }

    const bookings = await prisma.booking.findMany({
      where: { caregiverUserId: req.user.id },
    });

    const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
    const totalEarnings = completedBookings.reduce((sum, b) => sum + b.caregiverPayout, 0);
    const activeBookings = bookings.filter((b) =>
      ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
    );
    const pendingBookings = bookings.filter((b) => b.status === 'PENDING');

    res.json({
      success: true,
      data: {
        totalEarnings,
        completedCount: completedBookings.length,
        activeCount: activeBookings.length,
        pendingCount: pendingBookings.length,
        totalBookings: bookings.length,
        ratingAvg: profile.ratingAvg,
        ratingCount: profile.ratingCount,
        isVerified: profile.isVerified,
        verificationStatus: profile.verificationStatus,
        isAvailable: profile.isAvailable,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
