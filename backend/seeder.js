require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Temple = require('./models/Temple');
const DarshanSlot = require('./models/DarshanSlot');

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Temple.deleteMany({});
  await DarshanSlot.deleteMany({});

  console.log('🗑️  Cleared existing data');

  // Create users
  const admin = await User.create({ name: 'Admin User', email: 'admin@darshanease.com', phone: '9000000001', password: 'admin123', role: 'admin' });
  const organizer = await User.create({ name: 'Temple Organizer', email: 'organizer@darshanease.com', phone: '9000000002', password: 'organizer123', role: 'organizer' });
  const devotee = await User.create({ name: 'Ram Sharma', email: 'devotee@darshanease.com', phone: '9000000003', password: 'devotee123', role: 'user' });

  console.log('👥 Created users: admin, organizer, devotee');

  // Create temples
  const temples = await Temple.insertMany([
    {
      templeName: 'Tirupati Balaji Temple',
      location: 'Tirupati, Andhra Pradesh',
      description: 'One of the most visited religious sites in the world, dedicated to Lord Venkateswara.',
      deity: 'Lord Venkateswara',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
      darshanStartTime: '06:00',
      darshanEndTime: '22:00',
      organizerId: organizer._id,
      amenities: ['Prasadam', 'Cloakroom', 'Queue Management', 'Special Entry'],
      rating: 4.9,
      totalReviews: 12500
    },
    {
      templeName: 'Vaishno Devi Temple',
      location: 'Katra, Jammu & Kashmir',
      description: 'A sacred cave shrine dedicated to Goddess Vaishno Devi, nestled in the Trikuta Mountains.',
      deity: 'Goddess Vaishno Devi',
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
      darshanStartTime: '04:00',
      darshanEndTime: '23:00',
      organizerId: organizer._id,
      amenities: ['Helicopter Service', 'Pony Ride', 'Prasadam', 'Locker Facility'],
      rating: 4.8,
      totalReviews: 8900
    },
    {
      templeName: 'Golden Temple (Harmandir Sahib)',
      location: 'Amritsar, Punjab',
      description: 'The holiest Gurdwara of Sikhism, featuring stunning gold-plated architecture and sacred sarovar.',
      deity: 'Waheguru (God)',
      image: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800&q=80',
      darshanStartTime: '03:00',
      darshanEndTime: '23:00',
      organizerId: organizer._id,
      amenities: ['Langar (Free Meal)', 'Sarovar Bathing', 'Karah Prasad', 'Guided Tours'],
      rating: 4.9,
      totalReviews: 15000
    },
    {
      templeName: 'Somnath Temple',
      location: 'Prabhas Patan, Gujarat',
      description: 'One of the twelve Jyotirlinga shrines of Lord Shiva, situated on the western coast of India.',
      deity: 'Lord Shiva',
      image: 'https://images.unsplash.com/photo-1560179406-1c6c60e0faa9?w=800&q=80',
      darshanStartTime: '06:00',
      darshanEndTime: '22:00',
      organizerId: organizer._id,
      amenities: ['Light & Sound Show', 'Prasadam', 'Museum', 'Sea View'],
      rating: 4.7,
      totalReviews: 6700
    },
    {
      templeName: 'Meenakshi Amman Temple',
      location: 'Madurai, Tamil Nadu',
      description: 'A historic Hindu temple dedicated to Meenakshi (Parvati), featuring magnificent Dravidian architecture.',
      deity: 'Goddess Meenakshi',
      image: 'https://images.unsplash.com/photo-1514222026815-5a70af31c03a?w=800&q=80',
      darshanStartTime: '05:00',
      darshanEndTime: '21:30',
      organizerId: organizer._id,
      amenities: ['Hall of 1000 Pillars', 'Golden Lotus Tank', 'Temple Museum', 'Guided Tours'],
      rating: 4.8,
      totalReviews: 9200
    },
    {
      templeName: 'Kedarnath Temple',
      location: 'Rudraprayag, Uttarakhand',
      description: 'One of the holiest Hindu temples dedicated to Lord Shiva, situated in the Himalayas.',
      deity: 'Lord Shiva',
      image: 'https://images.unsplash.com/photo-1621768216002-5ac171d68e1f?w=800&q=80',
      darshanStartTime: '06:00',
      darshanEndTime: '20:00',
      organizerId: organizer._id,
      amenities: ['Helicopter Service', 'Prasadam', 'Trekking Routes', 'Medical Aid'],
      rating: 4.9,
      totalReviews: 7800
    }
  ]);

  console.log(`🛕 Created ${temples.length} temples`);

  // Create darshan slots for each temple
  const today = new Date();
  const slotDates = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    slotDates.push(d.toISOString().split('T')[0]);
  }

  const timeSlots = [
    { startTime: '06:00', endTime: '08:00', poojaType: 'Suprabhatam Darshan', price: 300 },
    { startTime: '08:00', endTime: '10:00', poojaType: 'General Darshan', price: 100 },
    { startTime: '10:00', endTime: '12:00', poojaType: 'General Darshan', price: 100 },
    { startTime: '12:00', endTime: '14:00', poojaType: 'Nitya Kalyanam Special', price: 500, isSpecial: true },
    { startTime: '14:00', endTime: '16:00', poojaType: 'General Darshan', price: 100 },
    { startTime: '16:00', endTime: '18:00', poojaType: 'Evening Darshan', price: 200 },
    { startTime: '18:00', endTime: '20:00', poojaType: 'Archana Special', price: 400, isSpecial: true },
    { startTime: '20:00', endTime: '22:00', poojaType: 'General Darshan', price: 100 }
  ];

  const allSlots = [];
  for (const temple of temples) {
    for (const date of slotDates) {
      for (const ts of timeSlots) {
        const totalSeats = Math.floor(Math.random() * 50) + 30;
        const used = Math.floor(Math.random() * 20);
        allSlots.push({
          templeId: temple._id,
          date,
          startTime: ts.startTime,
          endTime: ts.endTime,
          totalSeats,
          availableSeats: totalSeats - used,
          price: ts.price,
          poojaType: ts.poojaType,
          isSpecial: ts.isSpecial || false
        });
      }
    }
  }

  await DarshanSlot.insertMany(allSlots);
  console.log(`🕐 Created ${allSlots.length} darshan slots`);

  console.log('\n✅ Seeding complete!');
  console.log('📧 Admin:     admin@darshanease.com     / admin123');
  console.log('📧 Organizer: organizer@darshanease.com / organizer123');
  console.log('📧 Devotee:   devotee@darshanease.com   / devotee123\n');

  process.exit(0);
};

seedData().catch(err => { console.error(err); process.exit(1); });
