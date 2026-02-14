import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

// --- METAMASK LOGIN ---
export async function loginWithMetaMask() {
    const selectedRole = document.getElementById("userRole").value;
    if (!selectedRole) { alert("Please select a role!"); return; }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0].toLowerCase();

        // 1. Aapke structure ke mutabiq path 'users/walletAddress' hai
        const userRef = ref(db, `users/${walletAddress}`); 
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.role === selectedRole) {
                finalizeLogin(walletAddress, userData.fullname, userData.role);
            } else {
                alert(`Role Mismatch! You are a ${userData.role} in database.`);
            }
        } else {
            alert("Wallet not registered. Please register first.");
        }
    } catch (error) { console.error(error); }
}

// --- STANDARD (PHONE) LOGIN ---
async function handleTraditionalLogin() {
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();
    const selectedRole = document.getElementById("userRole").value;

    if (!phone || !password || !selectedRole) {
        document.getElementById("error").innerText = "Fill all fields and select role";
        return;
    }

    try {
        // 2. IMPORTANT: Aapka data 'users/phoneNumber' ke andar hai
        const userRef = ref(db, `users/${phone}`); 
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();

            // Password aur Role match check
            if (userData.password === password) {
                if (userData.role.toLowerCase() === selectedRole.toLowerCase()) {
                    finalizeLogin(phone, userData.fullname, userData.role);
                } else {
                    document.getElementById("error").innerText = `Access Denied: You are registered as ${userData.role}.`;
                }
            } else {
                document.getElementById("error").innerText = "Wrong Password!";
            }
        } else {
            document.getElementById("error").innerText = "User not found!";
        }
    } catch (error) {
        console.error(error);
        document.getElementById("error").innerText = "Connection Error.";
    }
}

function finalizeLogin(id, name, role) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userPhone", id);
    localStorage.setItem("userRole", role.toLowerCase()); // Lowercase for safety
    localStorage.setItem("userName", name);

    // Redirection Logic
    const userRole = role.toLowerCase();
    if (userRole === "admin") {
        window.location.href = "admin-dashboard.html";
    } else if (userRole === "police") {
        window.location.href = "police-dashboard.html";
    } else {
        window.location.href = "homepage.html";
    }
}

// Listeners
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
    const mmBtn = document.getElementById("metamaskBtn");
    if (loginBtn) loginBtn.addEventListener("click", handleTraditionalLogin);
    if (mmBtn) mmBtn.addEventListener("click", loginWithMetaMask);
});