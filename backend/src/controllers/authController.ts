import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, role, phone, address, city, caregiverDetails } = req.body;

    if (!email || !password || !fullName) {
      res.status(400).json({ success: false, message: 'Email, password, and full name are required.' });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = role === 'CAREGIVER' ? 'CAREGIVER' : role === 'ADMIN' ? 'ADMIN' : 'FAMILY';

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        fullName: fullName.trim(),
        role: assignedRole,
        phone: phone || null,
        address: address || null,
        city: city || null,
      },
    });

    // If caregiver, create profile
    let caregiverProfile = null;
    if (assignedRole === 'CAREGIVER') {
      caregiverProfile = await prisma.caregiverProfile.create({
        data: {
          userId: user.id,
          title: caregiverDetails?.title || 'Professional Healthcare Assistant',
          bio: caregiverDetails?.bio || 'Dedicated caregiver providing personalized, compassionate support.',
          yearsExperience: Number(caregiverDetails?.yearsExperience) || 2,
          hourlyRate: Number(caregiverDetails?.hourlyRate) || 25,
          dailyRate: Number(caregiverDetails?.dailyRate) || 180,
          qualifications: JSON.stringify(caregiverDetails?.qualifications || ['Certified Nursing Assistant (CNA)']),
          specializations: JSON.stringify(caregiverDetails?.specializations || ['Elderly Care', 'Vitals Monitoring']),
          serviceAreas: JSON.stringify(caregiverDetails?.serviceAreas || [city || 'Downtown']),
          languages: caregiverDetails?.languages || 'English',
          isVerified: false,
          verificationStatus: 'PENDING',
        },
      });

      // Seed initial document if provided
      if (caregiverDetails?.documentName) {
        await prisma.verificationDocument.create({
          data: {
            caregiverId: caregiverProfile.id,
            type: 'GOVT_ID',
            name: caregiverDetails.documentName,
            fileUrl: caregiverDetails.documentUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
            status: 'PENDING',
          },
        });
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        city: user.city,
        avatar: user.avatar,
        caregiverProfile,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        caregiverProfile: {
          include: { documents: true },
        },
      },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, message: 'Account is deactivated. Please contact support.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        avatar: user.avatar,
        caregiverProfile: user.caregiverProfile,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        caregiverProfile: {
          include: {
            documents: true,
          },
        },
        patients: true,
        _count: {
          select: {
            notifications: { where: { isRead: false } },
            bookings: true,
            caregiverBookings: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const { passwordHash, ...userData } = user;

    res.json({
      success: true,
      user: userData,
      unreadNotificationsCount: user._count.notifications,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { fullName, phone, address, city, avatar, emergencyContact } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(fullName && { fullName: fullName.trim() }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(avatar !== undefined && { avatar }),
        ...(emergencyContact !== undefined && { emergencyContact }),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        avatar: true,
        emergencyContact: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
