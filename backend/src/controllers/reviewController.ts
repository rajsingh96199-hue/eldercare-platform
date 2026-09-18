import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { bookingId, rating, comment, punctualityRating, careQualityRating, communicationRating } = req.body;

    if (!bookingId || !rating || !comment) {
      res.status(400).json({ success: false, message: 'Booking ID, rating (1-5), and comment are required.' });
      return;
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        caregiverUser: { include: { caregiverProfile: true } },
        review: true,
      },
    });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    if (booking.familyUserId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Only the booking client can submit a review.' });
      return;
    }

    if (booking.review) {
      res.status(409).json({ success: false, message: 'A review has already been submitted for this booking.' });
      return;
    }

    const caregiverProfile = booking.caregiverUser.caregiverProfile;
    if (!caregiverProfile) {
      res.status(404).json({ success: false, message: 'Caregiver profile not found.' });
      return;
    }

    const review = await prisma.review.create({
      data: {
        bookingId,
        userId: req.user.id,
        caregiverProfileId: caregiverProfile.id,
        rating: Math.max(1, Math.min(5, Number(rating))),
        comment: comment.trim(),
        punctualityRating: punctualityRating ? Number(punctualityRating) : 5,
        careQualityRating: careQualityRating ? Number(careQualityRating) : 5,
        communicationRating: communicationRating ? Number(communicationRating) : 5,
      },
      include: {
        user: { select: { fullName: true, avatar: true } },
      },
    });

    // Recalculate caregiver average rating
    const allReviews = await prisma.review.findMany({
      where: { caregiverProfileId: caregiverProfile.id },
      select: { rating: true },
    });

    const totalRatings = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAvg = Math.round((totalRatings / allReviews.length) * 10) / 10;

    await prisma.caregiverProfile.update({
      where: { id: caregiverProfile.id },
      data: {
        ratingAvg: newAvg,
        ratingCount: allReviews.length,
      },
    });

    // Notify Caregiver
    await prisma.notification.create({
      data: {
        userId: booking.caregiverUserId,
        title: `New ${rating}-Star Review Received!`,
        message: `${req.user.fullName} left a review: "${comment.slice(0, 50)}..."`,
        type: 'ALERT',
        link: `/caregiver/reviews`,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Thank you for your feedback!',
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { caregiverId } = req.query;
    const whereClause: any = {};

    if (caregiverId) {
      whereClause.caregiverProfileId = String(caregiverId);
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, fullName: true, avatar: true } },
        caregiverProfile: {
          include: { user: { select: { fullName: true } } },
        },
        booking: {
          select: { bookingNumber: true, service: { select: { title: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
