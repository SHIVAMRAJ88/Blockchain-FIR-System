// fir.js

// --------------------- Firebase Initialization ---------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEp1wVblbrb7rY-gqMQyiJLcQVQteecq8",
  authDomain: "fir-system-5a87b.firebaseapp.com",
  projectId: "fir-system-5a87b",
  storageBucket: "fir-system-5a87b.firebasestorage.app",
  messagingSenderId: "240923702550",
  appId: "1:240923702550:web:23ea3d84ed6817ce0f8c37",
  measurementId: "G-Y9NEY5KTBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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
