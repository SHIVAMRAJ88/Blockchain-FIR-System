import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your Firebase configuration
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmpassword").value;
    const passError = document.getElementById("passError");

    // 1. Check if passwords match
    if (password !== confirmPassword) {
        passError.textContent = "Passwords do not match!";
        passError.style.color = "#ff4d4d";
        return;
    }

    // 2. Clear previous error
    passError.textContent = "";

    // 3. User data object to be stored
    const userData = {
        fullname: fullname,
        phone: phone,
        email: email,
        password: password, // Storing password directly for project demo
        role: "citizen",
        createdAt: new Date().toISOString()
    };

    // 4. Store in Firebase Realtime Database
    // We use the phone number as the unique folder name for each user
    set(ref(db, 'users/' + phone), userData)
    .then(() => {
        alert("Registration Successful! Redirecting to Login...");
        window.location.href = "login.html";
    })
    .catch((error) => {
        console.error("Firebase Error:", error);
        alert("Registration failed. Please check your internet or Firebase rules.");
    });
});