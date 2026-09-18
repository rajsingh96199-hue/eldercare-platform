import request from 'supertest';
import app from '../src/app';
import prisma from '../src/lib/prisma';

describe('ElderCare API Automated Test Suite', () => {
  let familyToken: string;
  let caregiverToken: string;
  let adminToken: string;
  let familyUserId: string;
  let caregiverUserId: string;
  let testPatientId: string;
  let testServiceId: string;
  let testBookingId: string;

  beforeAll(async () => {
    // Authenticate with seeded demo accounts
    const familyRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'family@eldercare.com', password: 'Password123!' });
    familyToken = familyRes.body.token;
    familyUserId = familyRes.body.user.id;

    const caregiverRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nurse.sarah@eldercare.com', password: 'Password123!' });
    caregiverToken = caregiverRes.body.token;
    caregiverUserId = caregiverRes.body.user.id;

    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@eldercare.com', password: 'Password123!' });
    adminToken = adminRes.body.token;

    // Fetch a service for test booking
    const serviceRes = await request(app).get('/api/services');
    testServiceId = serviceRes.body.data[0].id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('1. Health & Disclaimer', () => {
    it('should return health status and emergency medical disclaimer', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.emergencyDisclaimer).toContain('not an emergency medical service');
    });
  });

  describe('2. Authentication & Authorization', () => {
    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'family@eldercare.com', password: 'WrongPassword' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fetch authenticated user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${familyToken}`);
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('family@eldercare.com');
      expect(res.body.user.role).toBe('FAMILY');
    });

    it('should register a new family user', async () => {
      const email = `testuser_${Date.now()}@example.com`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email,
          password: 'SecurePassword123!',
          fullName: 'Alice Walker',
          role: 'FAMILY',
          phone: '+1 (555) 111-2222',
          city: 'New York',
        });
      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(email);
    });
  });

  describe('3. Services & Caregiver Directory', () => {
    it('should list all active healthcare services', async () => {
      const res = await request(app).get('/api/services');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(4);
    });

    it('should list verified caregivers with filter support', async () => {
      const res = await request(app).get('/api/caregivers?isVerified=true');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].isVerified).toBe(true);
    });
  });

  describe('4. Patient Management', () => {
    it('should create an elderly patient profile', async () => {
      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${familyToken}`)
        .send({
          fullName: 'Grandmother Margaret',
          age: 88,
          gender: 'Female',
          relationship: 'Grandmother',
          medicalConditions: 'Mild Dementia, Arthritis',
          mobilityLevel: 'Needs Walker',
          emergencyContactName: 'Robert Jenkins',
          emergencyContactPhone: '+1 (555) 234-5678',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.fullName).toBe('Grandmother Margaret');
      testPatientId = res.body.data.id;
    });

    it('should list patients for the family user', async () => {
      const res = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${familyToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('5. Booking Lifecycle Workflow', () => {
    it('should create a new booking request in PENDING status', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${familyToken}`)
        .send({
          caregiverUserId,
          patientId: testPatientId,
          serviceId: testServiceId,
          bookingType: 'HOURLY',
          startDate: new Date().toISOString(),
          startTime: '10:00 AM',
          endTime: '02:00 PM',
          totalHours: 4,
          serviceAddress: '742 Evergreen Terrace',
          city: 'New York',
          specialInstructions: 'Please ring bell twice.',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('PENDING');
      expect(res.body.data.bookingNumber).toMatch(/^EC-/);
      testBookingId = res.body.data.id;
    });

    it('should allow caregiver to accept the booking (PENDING -> ACCEPTED)', async () => {
      const res = await request(app)
        .patch(`/api/bookings/${testBookingId}/status`)
        .set('Authorization', `Bearer ${caregiverToken}`)
        .send({ status: 'ACCEPTED' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('ACCEPTED');
    });

    it('should transition status through ON_THE_WAY -> ARRIVED -> IN_PROGRESS', async () => {
      const onTheWayRes = await request(app)
        .patch(`/api/bookings/${testBookingId}/status`)
        .set('Authorization', `Bearer ${caregiverToken}`)
        .send({ status: 'ON_THE_WAY' });
      expect(onTheWayRes.body.data.status).toBe('ON_THE_WAY');

      const arrivedRes = await request(app)
        .patch(`/api/bookings/${testBookingId}/status`)
        .set('Authorization', `Bearer ${caregiverToken}`)
        .send({ status: 'ARRIVED' });
      expect(arrivedRes.body.data.status).toBe('ARRIVED');

      const inProgressRes = await request(app)
        .patch(`/api/bookings/${testBookingId}/status`)
        .set('Authorization', `Bearer ${caregiverToken}`)
        .send({ status: 'IN_PROGRESS' });
      expect(inProgressRes.body.data.status).toBe('IN_PROGRESS');
    });

    it('should allow caregiver to log care notes and patient vitals', async () => {
      const res = await request(app)
        .post('/api/care-notes')
        .set('Authorization', `Bearer ${caregiverToken}`)
        .send({
          bookingId: testBookingId,
          bloodPressure: '122/80 mmHg',
          bloodSugar: '105 mg/dL',
          pulseRate: 72,
          temperature: 98.6,
          oxygenLevel: 99,
          medicationsAdministered: 'Multivitamin',
          notes: 'Patient was relaxed and completed morning walk comfortably.',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.bloodPressure).toBe('122/80 mmHg');
    });

    it('should complete the booking (IN_PROGRESS -> COMPLETED)', async () => {
      const res = await request(app)
        .patch(`/api/bookings/${testBookingId}/status`)
        .set('Authorization', `Bearer ${caregiverToken}`)
        .send({ status: 'COMPLETED' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('COMPLETED');
    });

    it('should allow family user to submit a review for completed booking', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${familyToken}`)
        .send({
          bookingId: testBookingId,
          rating: 5,
          comment: 'Outstanding care service! Highly attentive and professional.',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.rating).toBe(5);
    });
  });

  describe('6. Admin Analytics & Oversight', () => {
    it('should fetch admin platform analytics and financial KPIs', async () => {
      const res = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.users.total).toBeGreaterThanOrEqual(3);
      expect(res.body.data.financials.gmv).toBeGreaterThanOrEqual(0);
    });

    it('should reject non-admin access to admin endpoints', async () => {
      const res = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${familyToken}`);
      expect(res.status).toBe(403);
    });
  });
});
