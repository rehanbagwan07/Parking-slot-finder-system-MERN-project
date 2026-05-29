const mongoose = require('mongoose');
const User = require('./src/models/User');
const Location = require('./src/models/Location');
const Slot = require('./src/models/Slot');

const DEMO_USERS = [
  {id:"u1",name:"Rahul Patil",    email:"user@solapur.in",  password:"1234",  role:"user"},
  {id:"a1",name:"Admin Deshmukh", email:"admin@solapur.in", password:"admin", role:"admin"},
];

const LOCS = [
  {
    id:"P01", name:"Solapur Railway Station Lot",
    address:"Station Road, Solapur - 413001",
    area:"Station Road", type:"🚉 RAILWAY",
    total:30, price:20,
    lat:17.6720, lng:75.9057,
    mx:318, my:330,
    color:"#1e90ff", note:"Near platform 1 gate. Open 24hrs."
  },
  {
    id:"P02", name:"Bhuikot Fort Parking",
    address:"Near Bhuikot Fort, Siddheshwar Peth, Solapur",
    area:"Siddheshwar Peth", type:"🏰 HERITAGE",
    total:24, price:15,
    lat:17.6840, lng:75.9012,
    mx:248, my:230,
    color:"#ff9800", note:"Adjacent to fort entrance. Pay-and-park."
  },
  {
    id:"P03", name:"Siddheshwar Temple Lot",
    address:"Siddheshwar Lake Road, Solapur",
    area:"Siddheshwar Peth", type:"🛕 TEMPLE",
    total:20, price:10,
    lat:17.6855, lng:75.9028,
    mx:268, my:214,
    color:"#ff6b2b", note:"Free for 1hr. 2-wheeler & 4-wheeler zones."
  },
  {
    id:"P04", name:"Central Bus Stand Parking",
    address:"Marathwada Road, Solapur - 413002",
    area:"Bus Stand Area", type:"🚌 BUS STAND",
    total:40, price:20,
    lat:17.6770, lng:75.9090,
    mx:350, my:288,
    color:"#00c97a", note:"Multi-level parking. 24hrs. MSRTC managed."
  },
  {
    id:"P05", name:"Hutatma Chowk Parking",
    address:"Hutatma Chowk, Solapur",
    area:"City Centre", type:"🏙️ CITY CENTRE",
    total:18, price:25,
    lat:17.6868, lng:75.9064,
    mx:325, my:200,
    color:"#e040fb", note:"Central location. Near SMC building."
  },
  {
    id:"P06", name:"Solapur Municipal Corp. Lot",
    address:"Near SMC Building, Solapur",
    area:"City Centre", type:"🏛️ CIVIC",
    total:16, price:20,
    lat:17.6880, lng:75.9072,
    mx:335, my:188,
    color:"#26c6da", note:"Weekday 9AM-6PM. Govt permit required."
  }
];

const mkSlots = (locId,total) =>
  Array.from({length:total},(_,i)=>({
    id:`${locId}-${String(i+1).padStart(2,"0")}`,
    locId, label:`S${String(i+1).padStart(2,"0")}`,
    status: Math.random()<.42?(Math.random()<.55?"reserved":"occupied"):"available",
    bookingId:null,
  }));

async function seed() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/parkwise');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Location.deleteMany({});
    await Slot.deleteMany({});
    console.log('Cleared existing data');

    // Insert Users
    await User.insertMany(DEMO_USERS);
    console.log('Inserted Demo Users');

    // Insert Locations
    await Location.insertMany(LOCS);
    console.log('Inserted Locations');

    // Insert Slots
    let allSlots = [];
    LOCS.forEach(loc => {
      allSlots = allSlots.concat(mkSlots(loc.id, loc.total));
    });
    await Slot.insertMany(allSlots);
    console.log(`Inserted ${allSlots.length} Slots`);

    console.log('Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
