import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ElderCare Database Seeding...');

  // Clean previous data
  await prisma.notification.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.review.deleteMany();
  await prisma.careNote.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.verificationDocument.deleteMany();
  await prisma.caregiverProfile.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Platform Admin
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

  // 2. Create Family User
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

  // 3. Create Elderly Patients for Family User
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
      notes: 'Loves classical music and afternoon garden walks. Needs gentle reminder for morning water intake.',
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
      notes: 'Requires daily range-of-motion physiotherapy and cold compression after exercise.',
    },
  });

  // 4. Create Standard Services
  const serviceNursing = await prisma.service.create({
    data: {
      slug: 'nursing-care',
      title: 'Skilled Nursing Care',
      shortDesc: 'Registered & licensed nurses for medication, wound care, and vital monitoring.',
      description: 'Comprehensive clinical care delivered directly at home by certified registered nurses. Ideal for post-op dressing, IV infusion management, catheter care, insulin administration, and 24/7 vitals surveillance.',
      icon: 'Stethoscope',
      baseHourlyRate: 35.0,
      baseDailyRate: 240.0,
      features: JSON.stringify([
        'Wound Dressing & Bed Sore Management',
        'IV Infusion & Medication Administration',
        'Catheter & Stoma Care',
        'Vitals Tracking (BP, SpO2, Blood Sugar)',
        'Post-Surgical Suture Inspection',
      ]),
    },
  });

  const serviceAttendant = await prisma.service.create({
    data: {
      slug: 'elderly-attendant',
      title: 'Elderly Care Attendant',
      shortDesc: 'Compassionate assistance with daily living, bathing, mobility, and companionship.',
      description: 'Dedicated and patient attendants supporting your aging parents with hygiene, grooming, transfer assistance, nutritional meal prep, and cognitive stimulation activities.',
      icon: 'HeartHandshake',
      baseHourlyRate: 22.0,
      baseDailyRate: 150.0,
      features: JSON.stringify([
        'Bathing, Grooming & Personal Hygiene',
        'Assisted Walking & Fall Prevention',
        'Nutritious Meal Prep & Feeding Support',
        'Companionship & Cognitive Games',
        'Timely Medication Reminders',
      ]),
    },
  });

  const servicePhysio = await prisma.service.create({
    data: {
      slug: 'physiotherapy',
      title: 'Geriatric Physiotherapy',
      shortDesc: 'Specialized physical rehabilitation for stroke, joint pain, and mobility recovery.',
      description: 'In-home licensed physical therapists focusing on restoring joint mobility, strengthening leg muscles, gait balance training, and post-stroke rehabilitation.',
      icon: 'Activity',
      baseHourlyRate: 50.0,
      baseDailyRate: 320.0,
      features: JSON.stringify([
        'Joint Mobilization & Pain Relief',
        'Post-Fracture & Knee Rehab',
        'Stroke Neurological Rehabilitation',
        'Gait Training & Balance Enhancement',
        'Customized Daily Exercise Regimen',
      ]),
    },
  });

  const servicePostHospital = await prisma.service.create({
    data: {
      slug: 'post-hospital-care',
      title: 'Post-Hospital Transition Care',
      shortDesc: 'Intensive recovery support to prevent hospital readmissions after discharge.',
      description: 'Structured 360-degree convalescent care bridging hospital discharge and independent living, ensuring zero medication errors and swift wound healing.',
      icon: 'ShieldPlus',
      baseHourlyRate: 40.0,
      baseDailyRate: 260.0,
      features: JSON.stringify([
        'Discharge Protocol Adherence',
        'Drain Tube & Suture Management',
        'Doctor Tele-Follow-up Coordination',
        'Infection Prevention & Hygiene',
        'Continuous Vitals Logging',
      ]),
    },
  });

  // 5. Create Caregiver Users & Profiles
  // Caregiver 1: Sarah Jenkins (Registered Nurse)
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
      bio: 'B.Sc in Nursing with 8+ years of ICU and geriatric care experience. Passionate about providing dignified, clinical-grade medical care in the comfort of patient homes.',
      yearsExperience: 8,
      hourlyRate: 38.0,
      dailyRate: 250.0,
      qualifications: JSON.stringify(['B.Sc Nursing (NYU)', 'Registered Nurse (RN) License #NY-89421', 'BLS/ACLS Certified']),
      specializations: JSON.stringify(['Nursing Care', 'Post-Hospital Care', 'Wound Care', 'Diabetes Management']),
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

  await prisma.verificationDocument.createMany({
    data: [
      {
        caregiverId: nurseProfile.id,
        type: 'NURSING_LICENSE',
        name: 'State Nursing Board License - Active',
        fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
        status: 'VERIFIED',
        notes: 'Verified with NY State Licensing Registry.',
      },
      {
        caregiverId: nurseProfile.id,
        type: 'GOVT_ID',
        name: 'Passport & Real ID',
        fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
        status: 'VERIFIED',
        notes: 'Identity confirmed.',
      },
    ],
  });

  // Caregiver 2: Dr. Rahul Sharma (Physiotherapist)
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

  const physioProfile = await prisma.caregiverProfile.create({
    data: {
      userId: physioUser.id,
      title: 'Doctor of Physical Therapy (Geriatric Rehab)',
      bio: 'Doctorate in Physical Therapy specializing in orthopedic recovery, post-stroke neuromuscular re-education, and elderly balance/fall-prevention therapies.',
      yearsExperience: 6,
      hourlyRate: 55.0,
      dailyRate: 350.0,
      qualifications: JSON.stringify(['Doctor of Physical Therapy (DPT)', 'Certified Geriatric Physical Therapist (CGP)', 'State Board Licensed']),
      specializations: JSON.stringify(['Physiotherapy', 'Post-Hospital Care', 'Stroke Rehab', 'Joint Mobility']),
      serviceAreas: JSON.stringify(['New York', 'Manhattan', 'Midtown', 'Upper East Side']),
      languages: 'English, Hindi',
      isVerified: true,
      verificationStatus: 'VERIFIED',
      ratingAvg: 5.0,
      ratingCount: 19,
      totalHoursCompleted: 210,
      isAvailable: true,
    },
  });

  await prisma.verificationDocument.create({
    data: {
      caregiverId: physioProfile.id,
      type: 'PHYSICAL_THERAPY_LICENSE',
      name: 'State PT Board License',
      fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
      status: 'VERIFIED',
      notes: 'Active PT License verified.',
    },
  });

  // Caregiver 3: Priya Nair (Elder Attendant)
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

  const attendantProfile = await prisma.caregiverProfile.create({
    data: {
      userId: attendantUser.id,
      title: 'Certified Nursing Assistant & Elderly Companion',
      bio: 'Warm, empathetic, and attentive certified caregiver with 5 years experience assisting elderly seniors with dementia, Parkinson’s, and mobility constraints.',
      yearsExperience: 5,
      hourlyRate: 24.0,
      dailyRate: 160.0,
      qualifications: JSON.stringify(['Certified Nursing Assistant (CNA)', 'CPR/First Aid Certified', 'Dementia Care Specialist Cert']),
      specializations: JSON.stringify(['Elderly Attendant', 'Dementia Support', 'Companionship', 'Mobility Assistance']),
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

  // Caregiver 4: David Miller (Pending Verification)
  const pendingUser = await prisma.user.create({
    data: {
      email: 'caregiver.david@eldercare.com',
      passwordHash: defaultPasswordHash,
      fullName: 'David Miller',
      role: 'CAREGIVER',
      phone: '+1 (555) 789-0123',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      address: '202 Hudson St',
      city: 'New York',
    },
  });

  const pendingProfile = await prisma.caregiverProfile.create({
    data: {
      userId: pendingUser.id,
      title: 'Emergency Medical Technician & Home Aide',
      bio: 'Former paramedic transition to dedicated in-home elderly healthcare support and emergency preparedness assistance.',
      yearsExperience: 3,
      hourlyRate: 28.0,
      dailyRate: 190.0,
      qualifications: JSON.stringify(['EMT-Basic Certified', 'Home Health Aide (HHA)']),
      specializations: JSON.stringify(['Nursing Care', 'Elderly Attendant']),
      serviceAreas: JSON.stringify(['New York', 'Manhattan']),
      languages: 'English',
      isVerified: false,
      verificationStatus: 'PENDING',
      ratingAvg: 5.0,
      ratingCount: 0,
      isAvailable: true,
    },
  });

  await prisma.verificationDocument.create({
    data: {
      caregiverId: pendingProfile.id,
      type: 'EMT_CERTIFICATE',
      name: 'EMT Certification Document',
      fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
      status: 'PENDING',
      notes: 'Submitted for verification desk review.',
    },
  });

  // 6. Create Seed Bookings
  // Booking 1: Completed Nursing Care
  const bookingCompleted = await prisma.booking.create({
    data: {
      bookingNumber: 'EC-2026-8812',
      familyUserId: familyUser.id,
      caregiverUserId: nurseUser.id,
      patientId: patient1.id,
      serviceId: serviceNursing.id,
      bookingType: 'HOURLY',
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
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
      specialInstructions: 'Patient has morning hypertension medication at 9:30 AM.',
    },
  });

  // Care Note for Completed Booking
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
      medicationsAdministered: 'Lisinopril 10mg (9:30 AM), Multivitamin with breakfast',
      dietNotes: 'Ate full bowl of oatmeal with blueberries. Drank 450ml water.',
      mobilityExercises: '15 minutes guided indoor walking with walker.',
      moodState: 'Cheerful',
      notes: 'Patient was alert and cheerful. Blood pressure is well controlled within target range. Suture sites clean with zero erythema.',
    },
  });

  // Review for Completed Booking
  await prisma.review.create({
    data: {
      bookingId: bookingCompleted.id,
      userId: familyUser.id,
      caregiverProfileId: nurseProfile.id,
      rating: 5,
      punctualityRating: 5,
      careQualityRating: 5,
      communicationRating: 5,
      comment: 'Nurse Sarah was phenomenal! She arrived precisely on time, took meticulous vitals, and was so gentle and patient with my mother. Highly recommended!',
    },
  });

  // Booking 2: Active / In-Progress Physiotherapy
  const bookingInProgress = await prisma.booking.create({
    data: {
      bookingNumber: 'EC-2026-9041',
      familyUserId: familyUser.id,
      caregiverUserId: physioUser.id,
      patientId: patient2.id,
      serviceId: servicePhysio.id,
      bookingType: 'HOURLY',
      startDate: new Date(),
      startTime: '02:00 PM',
      endTime: '04:00 PM',
      totalHours: 2,
      hourlyRate: 55.0,
      totalAmount: 121.0,
      platformFee: 11.0,
      caregiverPayout: 110.0,
      status: 'IN_PROGRESS',
      serviceAddress: '742 Evergreen Terrace, Apt 4B',
      city: 'New York',
      specialInstructions: 'Focus on post-knee replacement bending exercises.',
    },
  });

  await prisma.careNote.create({
    data: {
      bookingId: bookingInProgress.id,
      caregiverProfileId: physioProfile.id,
      patientId: patient2.id,
      bloodPressure: '128/84 mmHg',
      pulseRate: 78,
      temperature: 98.6,
      oxygenLevel: 99,
      medicationsAdministered: 'Pain relief gel applied post-therapy',
      mobilityExercises: 'Active knee flexion achieved 95 degrees. Quadriceps isometric sets x 3.',
      moodState: 'Calm',
      notes: 'Excellent progress today on knee joint flexion. Patient completed all resistance band reps with minimal discomfort.',
    },
  });

  // Booking 3: Pending Approval Booking
  await prisma.booking.create({
    data: {
      bookingNumber: 'EC-2026-9430',
      familyUserId: familyUser.id,
      caregiverUserId: attendantUser.id,
      patientId: patient1.id,
      serviceId: serviceAttendant.id,
      bookingType: 'HOURLY',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      startTime: '10:00 AM',
      endTime: '02:00 PM',
      totalHours: 4,
      hourlyRate: 24.0,
      totalAmount: 105.6,
      platformFee: 9.6,
      caregiverPayout: 96.0,
      status: 'PENDING',
      serviceAddress: '742 Evergreen Terrace, Apt 4B',
      city: 'New York',
      specialInstructions: 'Companionship and meal prep.',
    },
  });

  // 7. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: familyUser.id,
        title: 'Care Session In Progress',
        message: 'Dr. Rahul Sharma has begun the Geriatric Physiotherapy session for Harold Jenkins.',
        type: 'BOOKING',
        link: `/bookings/${bookingInProgress.id}`,
        isRead: false,
      },
      {
        userId: nurseUser.id,
        title: 'New 5-Star Review Received!',
        message: 'Robert Jenkins left a glowing 5-star review for booking #EC-2026-8812.',
        type: 'ALERT',
        link: '/caregiver/reviews',
        isRead: false,
      },
      {
        userId: admin.id,
        title: 'Caregiver Verification Awaiting Review',
        message: 'David Miller submitted EMT credentials for platform verification.',
        type: 'VERIFICATION',
        link: '/admin/verifications',
        isRead: false,
      },
    ],
  });

  console.log('✅ ElderCare Database Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
