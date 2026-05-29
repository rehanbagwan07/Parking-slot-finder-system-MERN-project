const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');
let code = fs.readFileSync(appPath, 'utf8');

// 1. Add imports
code = code.replace(
  'import { useState, useEffect, useRef, useCallback } from "react";',
  `import { useState, useEffect, useRef, useCallback } from "react";\nimport * as api from "./api";`
);

// 2. Replace LOCS
const locsRegex = /const LOCS = \[\s*\{[\s\S]*?\}\s*,\s*\];/;
code = code.replace(locsRegex, 'let LOCS = [];');

// 3. Replace DEMO_USERS
const demoUsersRegex = /const DEMO_USERS=\[\s*\{[\s\S]*?\}\s*\];/;
code = code.replace(demoUsersRegex, '');

// 4. Update Auth
const authCodeOld = `  const usersRef=useRef([...DEMO_USERS]);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const submit=()=>{
    setErr("");
    if(tab==="login"){
      const u=usersRef.current.find(x=>x.email===f.email&&x.password===f.password);
      if(!u) return setErr("Invalid credentials. Use demo credentials below.");
      onLogin(u);
    } else {
      if(!f.name||!f.email||!f.password) return setErr("All fields required.");
      if(usersRef.current.find(x=>x.email===f.email)) return setErr("Email already registered.");
      const u={id:uid(),...f}; usersRef.current.push(u); onLogin(u);
    }
  };`;
const authCodeNew = `  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const submit=async ()=>{
    setErr("");
    try {
      if(tab==="login"){
        const u = await api.loginUser(f.email, f.password);
        onLogin(u);
      } else {
        if(!f.name||!f.email||!f.password) return setErr("All fields required.");
        const u = await api.registerUser(f);
        onLogin(u);
      }
    } catch (e) {
      setErr(e.response?.data?.error || "An error occurred");
    }
  };`;
code = code.replace(authCodeOld, authCodeNew);

// 5. Update App component initialization
const initSlotsRegex = /const INIT_SLOTS = LOCS\.flatMap\(loc=>mkSlots\(loc\.id,loc\.total\)\);/;
code = code.replace(initSlotsRegex, '');

const appInitOld = `export default function App(){
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [findLocId,setFindLocId]=useState(null);
  const [slots,setSlots]=useState(INIT_SLOTS);
  const [bookings,setBookings]=useState([]);
  const [toasts,setToasts]=useState([]);
  const [userPos,setUserPos]=useState(null);
  const [time,setTime]=useState(new Date());

  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t)},[]);`;

const appInitNew = `export default function App(){
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [findLocId,setFindLocId]=useState(null);
  const [slots,setSlots]=useState([]);
  const [bookings,setBookings]=useState([]);
  const [toasts,setToasts]=useState([]);
  const [userPos,setUserPos]=useState(null);
  const [time,setTime]=useState(new Date());
  const [locsLoaded,setLocsLoaded]=useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const locData = await api.fetchLocations();
        LOCS.length = 0; LOCS.push(...locData); // Update globally
        const slotsData = await api.fetchSlots();
        setSlots(slotsData);
        const bookingsData = await api.fetchBookings();
        setBookings(bookingsData);
        setLocsLoaded(true);
      } catch (e) { console.error(e); }
    };
    loadData();
  }, []);

  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t)},[]);`;
code = code.replace(appInitOld, appInitNew);

// 6. Stop live slot simulation override (since we want real data)
const simOld = `  // Live slot simulation (Socket.io equivalent)
  useEffect(()=>{
    if(!user) return;
    const id=setInterval(()=>{
      setSlots(p=>{
        const idx=Math.floor(Math.random()*p.length);
        const s=p[idx]; if(s.bookingId) return p;
        const next=s.status==="available"?"occupied":"available";
        return p.map((x,i)=>i===idx?{...x,status:next}:x);
      });
    },5000);
    return()=>clearInterval(id);
  },[user]);`;
const simNew = `  // Live slot simulation (Socket.io equivalent) - Optional: Poll backend for updates
  useEffect(()=>{
    if(!user) return;
    const id=setInterval(async ()=>{
      try {
        const slotsData = await api.fetchSlots();
        setSlots(slotsData);
        const bookingsData = await api.fetchBookings();
        setBookings(bookingsData);
      } catch (e) {}
    },5000);
    return()=>clearInterval(id);
  },[user]);`;
code = code.replace(simOld, simNew);

// 7. Prevent render if locs not loaded
const returnAuthOld = `  if(!user) return(<><style>{CSS}</style><Auth onLogin={u=>{setUser(u);setPage(u.role==="admin"?"admin":"dashboard")}}/></>);`;
const returnAuthNew = `  if(!locsLoaded) return <div style={{padding:20,color:'white'}}>Loading...</div>;\n  if(!user) return(<><style>{CSS}</style><Auth onLogin={u=>{setUser(u);setPage(u.role==="admin"?"admin":"dashboard")}}/></>);`;
code = code.replace(returnAuthOld, returnAuthNew);

// 8. Update FindPark confirm
const confirmOld = `    const bk={id:uid(),userId:user.id,userName:user.name,slotId:selSlot.id,slotLabel:selSlot.label,
      locId:selLoc.id,locName:selLoc.name,locType:selLoc.type,vehicle:f.vehicle.toUpperCase(),
      startTime:f.startTime,endTime:f.endTime,hours:hrs,amount:amt,status:"active",createdAt:nowISO()};
    setBookings(p=>[bk,...p]);
    setSlots(p=>p.map(s=>s.id===selSlot.id?{...s,status:"reserved",bookingId:bk.id}:s));
    setShowModal(false); setSelSlot(null);
    addToast(\`✓ Slot \${selSlot.label} booked at \${selLoc.name}!\`,"ok");`;
const confirmNew = `    const bk={userId:user.id,userName:user.name,slotId:selSlot.id,slotLabel:selSlot.label,
      locId:selLoc.id,locName:selLoc.name,locType:selLoc.type,vehicle:f.vehicle.toUpperCase(),
      startTime:f.startTime,endTime:f.endTime,hours:hrs,amount:amt,status:"active"};
    api.createBooking(bk).then(newBk => {
      setBookings(p=>[newBk,...p]);
      setSlots(p=>p.map(s=>s.id===selSlot.id?{...s,status:"reserved",bookingId:newBk.id}:s));
      setShowModal(false); setSelSlot(null);
      addToast(\`✓ Slot \${selSlot.label} booked at \${selLoc.name}!\`,"ok");
    }).catch(e => addToast(e.response?.data?.error || "Booking failed", "err"));`;
code = code.replace(confirmOld, confirmNew);

// 9. Update cancel
const cancelOld = `  const cancel=b=>{
    setBookings(p=>p.map(x=>x.id===b.id?{...x,status:"cancelled"}:x));
    setSlots(p=>p.map(s=>s.id===b.slotId?{...s,status:"available",bookingId:null}:s));
    addToast(\`Booking \${b.slotLabel} cancelled\`,"warn");
  };`;
const cancelNew = `  const cancel=b=>{
    api.cancelBooking(b.id).then(() => {
      setBookings(p=>p.map(x=>x.id===b.id?{...x,status:"cancelled"}:x));
      setSlots(p=>p.map(s=>s.id===b.slotId?{...s,status:"available",bookingId:null}:s));
      addToast(\`Booking \${b.slotLabel} cancelled\`,"warn");
    });
  };`;
code = code.replace(cancelOld, cancelNew);

// 10. Update Admin Actions
const markDoneOld = `  const markDone=b=>{
    setBookings(p=>p.map(x=>x.id===b.id?{...x,status:"completed"}:x));
    setSlots(p=>p.map(s=>s.id===b.slotId?{...s,status:"available",bookingId:null}:s));
    addToast(\`Booking \${b.slotLabel} completed\`,"ok");
  };`;
const markDoneNew = `  const markDone=b=>{
    api.completeBooking(b.id).then(() => {
      setBookings(p=>p.map(x=>x.id===b.id?{...x,status:"completed"}:x));
      setSlots(p=>p.map(s=>s.id===b.slotId?{...s,status:"available",bookingId:null}:s));
      addToast(\`Booking \${b.slotLabel} completed\`,"ok");
    });
  };`;
code = code.replace(markDoneOld, markDoneNew);

const setSlotStOld = `const setSlotSt=(slot,st)=>{setSlots(p=>p.map(s=>s.id===slot.id?{...s,status:st}:s));addToast(\`\${slot.label} → \${st}\`,"ok")};`;
const setSlotStNew = `const setSlotSt=(slot,st)=>{
    api.updateSlotStatus(slot.id, st).then(() => {
      setSlots(p=>p.map(s=>s.id===slot.id?{...s,status:st}:s));
      addToast(\`\${slot.label} → \${st}\`,"ok");
    });
  };`;
code = code.replace(setSlotStOld, setSlotStNew);

const addLocOld = `              addToast("✓ Location saved (backend persistence required)","warn");
              setNL({name:"",address:"",price:"",total:"",type:"🏙️ CITY CENTRE"});`;
const addLocNew = `              api.createLocation(nL).then(newLoc => {
                LOCS.push(newLoc);
                addToast("✓ Location saved successfully","ok");
                setNL({name:"",address:"",price:"",total:"",type:"🏙️ CITY CENTRE"});
              });`;
code = code.replace(addLocOld, addLocNew);

fs.writeFileSync(appPath, code);
console.log('App.jsx transformed');
