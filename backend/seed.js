require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const WasteRequest = require('./models/WasteRequest');

const categories = ['Organic', 'Recyclable', 'E-Waste', 'Hazardous', 'General'];
const statuses = ['Pending', 'Scheduled', 'In Progress', 'Collected', 'Cancelled'];
const quantities = ['1 bag', '2-3 bags', '4-5 bags', '6+ bags', '1 bin', 'Half bin'];
const times = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];

const residents = [
  { name: 'Priya Sharma', phone: '9876543210', address: '12, MG Road, Koramangala, Bangalore' },
  { name: 'Rahul Gupta', phone: '9123456789', address: '45, Anna Nagar, Chennai' },
  { name: 'Ananya Patel', phone: '9988776655', address: '78, Banjara Hills, Hyderabad' },
  { name: 'Vikram Singh', phone: '8877665544', address: '23, Connaught Place, Delhi' },
  { name: 'Meena Iyer', phone: '7766554433', address: '56, FC Road, Pune' },
  { name: 'Arjun Nair', phone: '6655443322', address: '90, Marine Drive, Mumbai' },
  { name: 'Kavya Reddy', phone: '9111222333', address: '34, Jubilee Hills, Hyderabad' },
  { name: 'Suresh Kumar', phone: '9444555666', address: '67, Salt Lake, Kolkata' },
];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function dateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

const seedRequests = [
  { ...residents[0], category: 'Organic', qty: '2-3 bags', date: dateOffset(1), time: '08:00 AM', status: 'Pending', notes: 'Kitchen and garden waste' },
  { ...residents[1], category: 'Recyclable', qty: '4-5 bags', date: dateOffset(2), time: '10:00 AM', status: 'Scheduled', notes: 'Newspapers and plastic bottles' },
  { ...residents[2], category: 'E-Waste', qty: '1 bag', date: dateOffset(0), time: '02:00 PM', status: 'In Progress', notes: 'Old laptops and mobile phones' },
  { ...residents[3], category: 'Hazardous', qty: '1 bin', date: dateOffset(-1), time: '12:00 PM', status: 'Collected', notes: 'Paint cans and batteries' },
  { ...residents[4], category: 'General', qty: '6+ bags', date: dateOffset(3), time: '06:00 PM', status: 'Pending', notes: '' },
  { ...residents[5], category: 'Recyclable', qty: '2-3 bags', date: dateOffset(-2), time: '08:00 AM', status: 'Collected', notes: 'Glass bottles and aluminium cans' },
  { ...residents[6], category: 'Organic', qty: '1 bin', date: dateOffset(1), time: '10:00 AM', status: 'Scheduled', notes: 'Food waste from restaurant' },
  { ...residents[7], category: 'E-Waste', qty: '2-3 bags', date: dateOffset(4), time: '04:00 PM', status: 'Pending', notes: 'Old TV and DVD player' },
  { ...residents[0], category: 'General', qty: '4-5 bags', date: dateOffset(-3), time: '02:00 PM', status: 'Collected', notes: '' },
  { ...residents[1], category: 'Hazardous', qty: '1 bag', date: dateOffset(2), time: '12:00 PM', status: 'Pending', notes: 'Medical waste — sharps container' },
  { ...residents[2], category: 'Recyclable', qty: '1 bin', date: dateOffset(-1), time: '08:00 AM', status: 'Cancelled', notes: 'Will reschedule next week' },
  { ...residents[3], category: 'Organic', qty: '2-3 bags', date: dateOffset(5), time: '06:00 PM', status: 'Pending', notes: 'Garden trimmings' },
  { ...residents[4], category: 'E-Waste', qty: '6+ bags', date: dateOffset(-4), time: '10:00 AM', status: 'Collected', notes: 'Office clearance — multiple devices' },
  { ...residents[5], category: 'General', qty: '2-3 bags', date: dateOffset(3), time: '04:00 PM', status: 'Scheduled', notes: '' },
  { ...residents[6], category: 'Recyclable', qty: '4-5 bags', date: dateOffset(1), time: '02:00 PM', status: 'In Progress', notes: 'Cardboard boxes' },
  { ...residents[7], category: 'Hazardous', qty: 'Half bin', date: dateOffset(-2), time: '08:00 AM', status: 'Collected', notes: 'Chemical cleaners' },
  { ...residents[0], category: 'Organic', qty: '1 bag', date: dateOffset(6), time: '10:00 AM', status: 'Pending', notes: '' },
  { ...residents[1], category: 'General', qty: '1 bin', date: dateOffset(-5), time: '12:00 PM', status: 'Collected', notes: '' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await WasteRequest.deleteMany({});
  console.log('Cleared existing requests');

  const docs = seedRequests.map((r, i) => ({
    requestId: 'ECO-' + uuidv4().substring(0, 8).toUpperCase(),
    userName: r.name,
    phone: r.phone,
    address: r.address,
    wasteCategory: r.category,
    quantity: r.qty,
    preferredDate: r.date,
    preferredTime: r.time,
    notes: r.notes,
    status: r.status,
    collectorNotes: r.status === 'Collected' ? 'Collected and disposed properly.' : '',
    // Spread creation dates over past 14 days for realistic chart data
    createdAt: new Date(Date.now() - (i % 14) * 24 * 60 * 60 * 1000),
  }));

  await WasteRequest.insertMany(docs);
  console.log(`✅ Seeded ${docs.length} requests successfully!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
