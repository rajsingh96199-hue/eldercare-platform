import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, count: services.length, data: services });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const service = await prisma.service.findUnique({
      where: { slug },
    });

    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }

    res.json({ success: true, data: service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug, title, shortDesc, description, icon, baseHourlyRate, baseDailyRate, features } = req.body;

    if (!slug || !title || !shortDesc || !baseHourlyRate) {
      res.status(400).json({ success: false, message: 'Missing required service fields.' });
      return;
    }

    const service = await prisma.service.create({
      data: {
        slug: slug.toLowerCase().trim(),
        title: title.trim(),
        shortDesc: shortDesc.trim(),
        description: description || shortDesc,
        icon: icon || 'HeartHandshake',
        baseHourlyRate: Number(baseHourlyRate),
        baseDailyRate: Number(baseDailyRate || baseHourlyRate * 7),
        features: typeof features === 'string' ? features : JSON.stringify(features || []),
      },
    });

    res.status(201).json({ success: true, data: service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, shortDesc, description, icon, baseHourlyRate, baseDailyRate, features, isActive } = req.body;

    const updated = await prisma.service.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(shortDesc && { shortDesc: shortDesc.trim() }),
        ...(description && { description }),
        ...(icon && { icon }),
        ...(baseHourlyRate !== undefined && { baseHourlyRate: Number(baseHourlyRate) }),
        ...(baseDailyRate !== undefined && { baseDailyRate: Number(baseDailyRate) }),
        ...(features && {
          features: typeof features === 'string' ? features : JSON.stringify(features),
        }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
