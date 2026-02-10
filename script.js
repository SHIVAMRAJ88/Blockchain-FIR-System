import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCEp1wVblbrb7rY-gqMQyiJLcQVQteecq8",
    authDomain: "fir-system-5a87b.firebaseapp.com",
    databaseURL: "https://fir-system-5a87b-default-rtdb.firebaseio.com",
    projectId: "fir-system-5a87b",
    storageBucket: "fir-system-5a87b.firebasestorage.app",
    messagingSenderId: "240923702550",
    appId: "1:240923702550:web:23ea3d84ed6817ce0f8c37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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