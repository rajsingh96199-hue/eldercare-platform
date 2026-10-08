import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

export async function ensureDefaultData() {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) return;

    console.log('🌱 Empty database detected. Initializing ElderCare default demo data...');

    const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

    // 1. Admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin@eldercare.com',
        passwordHash: defaultPasswordHash,
        fullName: 'Dr. Arthur Vance (Platform Director)',
        role: 'ADMIN',
        phone: '+1 (555) 019-2831',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        address: 'ElderCare HQ, 100 Health Plaza',
        city: 'New York',
      },
    });

    // 2. Family User
    const familyUser = await prisma.user.create({
      data: {
        email: 'family@eldercare.com',
        passwordHash: defaultPasswordHash,
        fullName: 'Robert Jenkins',
        role: 'FAMILY',
        phone: '+1 (555) 234-5678',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        address: '742 Evergreen Terrace, Apt 4B',
        city: 'New York',
        emergencyContact: '+1 (555) 987-6543 (Sibling Alice)',
      },
    });

    // 3. Patients
    const patient1 = await prisma.patient.create({
      data: {
        familyUserId: familyUser.id,
        fullName: 'Eleanor Jenkins',
        age: 82,
        gender: 'Female',
        relationship: 'Mother',
        medicalConditions: 'Stage 1 Hypertension, Mild Cognitive Decline, Osteoarthritis',
        allergies: 'Penicillin, Sulfa drugs',
        mobilityLevel: 'Needs Walker',
        dietaryNeeds: 'Low-sodium, pureed fruits, diabetic-friendly',
        emergencyContactName: 'Robert Jenkins (Son)',
        emergencyContactPhone: '+1 (555) 234-5678',
        doctorName: 'Dr. Elizabeth Warren (Geriatrician)',
        doctorPhone: '+1 (555) 345-9876',
        notes: 'Loves classical music and afternoon garden walks.',
      },
    });

    const patient2 = await prisma.patient.create({
      data: {
        familyUserId: familyUser.id,
        fullName: 'Harold Jenkins',
        age: 85,
        gender: 'Male',
        relationship: 'Father',
        medicalConditions: 'Post-Knee Arthroplasty (2 weeks post-op), Type 2 Diabetes',
        allergies: 'Latex',
        mobilityLevel: 'Needs Cane/Walker',
        dietaryNeeds: 'Diabetic carb-controlled diet',
        emergencyContactName: 'Robert Jenkins (Son)',
        emergencyContactPhone: '+1 (555) 234-5678',
        doctorName: 'Dr. Marcus Vance (Orthopedic Surgeon)',
        doctorPhone: '+1 (555) 456-1122',
        notes: 'Requires daily range-of-motion physiotherapy.',
      },
    });

    // 4. Services
    const serviceNursing = await prisma.service.create({
      data: {
        slug: 'nursing-care',
        title: 'Skilled Nursing Care',
        shortDesc: 'Registered & licensed nurses for medication, wound care, and vital monitoring.',
        description: 'Comprehensive clinical care delivered directly at home by certified registered nurses.',
        icon: 'Stethoscope',
        baseHourlyRate: 35.0,
        baseDailyRate: 240.0,
        features: JSON.stringify([
          'Wound Dressing & Bed Sore Management',
          'IV Infusion & Medication Administration',
          'Catheter & Stoma Care',
          'Vitals Tracking (BP, SpO2, Blood Sugar)',
        ]),
      },
    });

    const serviceAttendant = await prisma.service.create({
      data: {
        slug: 'elderly-attendant',
        title: 'Elderly Care Attendant',
        shortDesc: 'Compassionate assistance with daily living, bathing, mobility, and companionship.',
        description: 'Dedicated attendants supporting seniors with hygiene, grooming, transfer assistance, and meal prep.',
        icon: 'HeartHandshake',
        baseHourlyRate: 22.0,
        baseDailyRate: 150.0,
        features: JSON.stringify([
          'Bathing, Grooming & Personal Hygiene',
          'Assisted Walking & Fall Prevention',
          'Nutritious Meal Prep & Feeding Support',
          'Companionship & Timely Med Reminders',
        ]),
      },
    });

    const servicePhysio = await prisma.service.create({
      data: {
        slug: 'physiotherapy',
        title: 'Geriatric Physiotherapy',
        shortDesc: 'Specialized physical rehabilitation for stroke, joint pain, and mobility recovery.',
        description: 'In-home licensed physical therapists focusing on joint mobility, strengthening, and gait balance.',
        icon: 'Activity',
        baseHourlyRate: 50.0,
        baseDailyRate: 320.0,
        features: JSON.stringify([
          'Joint Mobilization & Pain Relief',
          'Post-Fracture & Knee Rehab',
          'Stroke Neurological Rehabilitation',
          'Gait Training & Balance Enhancement',
        ]),
      },
    });

    const servicePostHospital = await prisma.service.create({
      data: {
        slug: 'post-hospital-care',
        title: 'Post-Hospital Transition Care',
        shortDesc: 'Intensive recovery support to prevent hospital readmissions after discharge.',
        description: 'Structured convalescent care bridging hospital discharge and independent living.',
        icon: 'ShieldPlus',
        baseHourlyRate: 40.0,
        baseDailyRate: 260.0,
        features: JSON.stringify([
          'Discharge Protocol Adherence',
          'Drain Tube & Suture Management',
          'Doctor Tele-Follow-up Coordination',
          'Continuous Vitals Logging',
        ]),
      },
    });

    // 5. Caregivers
    // Caregiver 1: Nurse Sarah
    const nurseUser = await prisma.user.create({
      data: {
        email: 'nurse.sarah@eldercare.com',
        passwordHash: defaultPasswordHash,
        fullName: 'Sarah Jenkins, RN',
        role: 'CAREGIVER',
        phone: '+1 (555) 432-8765',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
        address: '124 Lexington Ave',
        city: 'New York',
      },
    });

    const nurseProfile = await prisma.caregiverProfile.create({
      data: {
        userId: nurseUser.id,
        title: 'Registered Critical Care Nurse & Senior Specialist',
        bio: 'B.Sc in Nursing with 8+ years of ICU and geriatric care experience.',
        yearsExperience: 8,
        hourlyRate: 38.0,
        dailyRate: 250.0,
        qualifications: JSON.stringify(['B.Sc Nursing (NYU)', 'Registered Nurse (RN) License #NY-89421']),
        specializations: JSON.stringify(['Nursing Care', 'Post-Hospital Care', 'Wound Care']),
        serviceAreas: JSON.stringify(['New York', 'Manhattan', 'Brooklyn', 'Queens']),
        languages: 'English, Spanish',
        isVerified: true,
        verificationStatus: 'VERIFIED',
        ratingAvg: 4.9,
        ratingCount: 28,
        totalHoursCompleted: 340,
        isAvailable: true,
      },
    });

    // Caregiver 2: Dr. Rahul Sharma
    const physioUser = await prisma.user.create({
      data: {
        email: 'physio.rahul@eldercare.com',
        passwordHash: defaultPasswordHash,
        fullName: 'Dr. Rahul Sharma, DPT',
        role: 'CAREGIVER',
        phone: '+1 (555) 678-1234',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
        address: '58 Wall Street',
        city: 'New York',
      },
    });

    await prisma.caregiverProfile.create({
      data: {
        userId: physioUser.id,
        title: 'Doctor of Physical Therapy (Geriatric Rehab)',
        bio: 'Doctorate in Physical Therapy specializing in orthopedic recovery.',
        yearsExperience: 6,
        hourlyRate: 55.0,
        dailyRate: 350.0,
        qualifications: JSON.stringify(['Doctor of Physical Therapy (DPT)', 'State Board Licensed']),
        specializations: JSON.stringify(['Physiotherapy', 'Post-Hospital Care', 'Stroke Rehab']),
        serviceAreas: JSON.stringify(['New York', 'Manhattan', 'Midtown']),
        languages: 'English, Hindi',
        isVerified: true,
        verificationStatus: 'VERIFIED',
        ratingAvg: 5.0,
        ratingCount: 19,
        totalHoursCompleted: 210,
        isAvailable: true,
      },
    });

    // Caregiver 3: Priya Nair
    const attendantUser = await prisma.user.create({
      data: {
        email: 'attendant.priya@eldercare.com',
        passwordHash: defaultPasswordHash,
        fullName: 'Priya Nair, CNA',
        role: 'CAREGIVER',
        phone: '+1 (555) 890-3456',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        address: '89 Broadway Ave',
        city: 'New York',
      },
    });

    await prisma.caregiverProfile.create({
      data: {
        userId: attendantUser.id,
        title: 'Certified Nursing Assistant & Elderly Companion',
        bio: 'Warm, empathetic certified caregiver with 5 years experience.',
        yearsExperience: 5,
        hourlyRate: 24.0,
        dailyRate: 160.0,
        qualifications: JSON.stringify(['Certified Nursing Assistant (CNA)', 'CPR/First Aid Certified']),
        specializations: JSON.stringify(['Elderly Attendant', 'Dementia Support', 'Companionship']),
        serviceAreas: JSON.stringify(['New York', 'Brooklyn', 'Queens']),
        languages: 'English, Malayalam',
        isVerified: true,
        verificationStatus: 'VERIFIED',
        ratingAvg: 4.85,
        ratingCount: 34,
        totalHoursCompleted: 420,
        isAvailable: true,
      },
    });

    // 6. Completed seed booking
    const bookingCompleted = await prisma.booking.create({
      data: {
        bookingNumber: 'EC-2026-8812',
        familyUserId: familyUser.id,
        caregiverUserId: nurseUser.id,
        patientId: patient1.id,
        serviceId: serviceNursing.id,
        bookingType: 'HOURLY',
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        startTime: '09:00 AM',
        endTime: '01:00 PM',
        totalHours: 4,
        hourlyRate: 38.0,
        totalAmount: 167.2,
        platformFee: 15.2,
        caregiverPayout: 152.0,
        status: 'COMPLETED',
        serviceAddress: '742 Evergreen Terrace, Apt 4B',
        city: 'New York',
      },
    });

    await prisma.careNote.create({
      data: {
        bookingId: bookingCompleted.id,
        caregiverProfileId: nurseProfile.id,
        patientId: patient1.id,
        bloodPressure: '124/82 mmHg',
        bloodSugar: '108 mg/dL',
        pulseRate: 74,
        temperature: 98.4,
        oxygenLevel: 98,
        medicationsAdministered: 'Lisinopril 10mg (9:30 AM)',
        notes: 'Patient was alert and cheerful. Blood pressure well controlled.',
      },
    });

    console.log('✅ ElderCare default demo data initialized successfully.');
  } catch (error) {
    console.error('⚠️ Auto-seed non-fatal error:', error);
  }
}
