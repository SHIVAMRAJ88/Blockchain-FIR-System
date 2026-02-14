// fir.js

// --------------------- Firebase Initialization ---------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import { initializeApp } from "firebase/app";

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


// Initialize Firebase

const db = getDatabase(app);

// --------------------- FIR Form Handling (Step 1: Victim Details) ---------------------
const firForm = document.getElementById("firForm");

firForm.addEventListener("submit", function(e){
    e.preventDefault();

    // Collect victim details
    const victimData = {
        name: document.getElementById("name").value,
        address: document.getElementById("address").value,
        phone: document.getElementById("phone").value,
        state: document.getElementById("state").value,
        city: document.getElementById("city").value,
        pincode: document.getElementById("pincode").value
    };

    // Store temporarily in localStorage to pass to crime.html
    localStorage.setItem("victimData", JSON.stringify(victimData));

    // Redirect to crime.html
    window.location.href = "crime.html";
});
