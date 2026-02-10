import { db } from "./firebase.js";
import { ref, set, push } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ✅ Form & Inputs Select
const crimeForm = document.getElementById("crimeWitnessForm");
const crimeSelect = document.getElementById("crimeSelect");
const otherCrime = document.getElementById("otherCrime");


// ✅ Random ID Generator
function generateRandomID(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

// ✅ SUBMIT FIR
crimeForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Generate random FIR ID
  const randomFIRID = generateRandomID();

  // Victim Data
  const victimData = JSON.parse(localStorage.getItem("victimData"));
  if (!victimData) {
    alert("❌ Victim data missing!");
    return;
  }

  // Crime Data
  const crimeData = {
    crimeType:
      crimeSelect.value === "Other"
        ? otherCrime.value
        : crimeSelect.value,
    details: document.getElementById("details").value,
    date: document.getElementById("userDate").value,
    time: document.getElementById("userTime").value,
    location: document.getElementById("location").value,
    accused: document.getElementById("nameofaccused").value
  };

  // Witness Data
  const witnessData = {
    name: document.getElementById("nameofwitness").value,
    phone: document.getElementById("witnessphone").value,
    address: document.getElementById("witnessAddress").value,
    state: document.getElementById("witnessState").value,
    city: document.getElementById("witnessCity").value,
    pincode: document.getElementById("witnessPinCode").value
  };

  // Final FIR Object
  const FIRData = {
    firID: randomFIRID,   // ✅ Add random FIR ID here
    victim: victimData,
    crime: crimeData,
    witness: witnessData,
    status: "Filed",
    timestamp: Date.now()
  };

  // Save to Firebase
  const firRef = ref(db, "FIRs");
  const newFIRRef = push(firRef);

  set(newFIRRef, FIRData)
    .then(() => {
      // ✅ Show success with FIR ID
      alert(`✅ FIR submitted successfully! Your FIR ID is: ${randomFIRID}`);

      localStorage.removeItem("victimData");
      crimeForm.reset();

      window.location.href = "evidence.html";
    })
    .catch((error) => {
      alert("❌ Firebase Error: " + error.message);
    });
});
