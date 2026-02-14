import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);



const db = getDatabase(app);

// ✅ NEW: Blockchain Hashing (Includes previousHash)
async function generateChainedHash(fir, prevHash) {
    const secureData = {
        crime: {
            accused: fir.crime.accused,
            crimeType: fir.crime.crimeType,
            date: fir.crime.date,
            details: fir.crime.details,
            location: fir.crime.location,
            time: fir.crime.time
        },
        victim: {
            address: fir.victim.address,
            city: fir.victim.city,
            name: fir.victim.name,
            phone: fir.victim.phone,
            pincode: fir.victim.pincode,
            state: fir.victim.state
        },
        witness: {
            address: fir.witness.address,
            city: fir.witness.city,
            name: fir.witness.name,
            phone: fir.witness.phone,
            pincode: fir.witness.pincode,
            state: fir.witness.state
        },
        previousHash: prevHash // 👈 The Blockchain Link
    };

    const dataString = JSON.stringify(secureData);
    const msgUint8 = new TextEncoder().encode(dataString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const crimeForm = document.getElementById("crimeWitnessForm");

crimeForm.addEventListener("submit", async function(e) {
  e.preventDefault();

  // 1. Fetch the hash of the very last FIR in the system
  const firsRef = ref(db, "FIRs");
  const lastFirQuery = query(firsRef, limitToLast(1));
  const snapshot = await get(lastFirQuery);
  
  let prevHash = "00000000000000000000000000000000"; // Genesis link
  if (snapshot.exists()) {
      const lastEntry = Object.values(snapshot.val())[0];
      prevHash = lastEntry.dataHash || prevHash;
  }

  const victimData = JSON.parse(localStorage.getItem("victimData"));
  victimData.phone = localStorage.getItem("userPhone");

  const FIRData = {
    firID: Math.random().toString(36).substring(2, 12),
    victim: victimData,
    crime: {
        crimeType: document.getElementById("crimeSelect").value,
        details: document.getElementById("details").value,
        date: document.getElementById("userDate").value,
        time: document.getElementById("userTime").value,
        location: document.getElementById("location").value,
        accused: document.getElementById("nameofaccused").value
    },
    witness: {
        name: document.getElementById("nameofwitness").value,
        phone: document.getElementById("witnessphone").value,
        address: document.getElementById("witnessAddress").value,
        state: document.getElementById("witnessState").value,
        city: document.getElementById("witnessCity").value,
        pincode: document.getElementById("witnessPinCode").value
    },
    previousHash: prevHash, // ✅ Store the link
    status: "Filed",
    timestamp: Date.now()
  };

  // 2. Generate hash including the previous link
  FIRData.dataHash = await generateChainedHash(FIRData, prevHash);

  set(push(ref(db, "FIRs")), FIRData)
    .then(() => {
      alert("FIR Chained to Blockchain!");
      window.location.href = "dashboard.html";
    });
});