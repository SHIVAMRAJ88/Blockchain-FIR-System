import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCEp1wVblbrb7rY-gqMQyiJLcQVQteecq8",
    authDomain: "fir-system-5a87b.firebaseapp.com",
    databaseURL: "https://fir-system-5a87b-default-rtdb.firebaseio.com",
    projectId: "fir-system-5a87b",
    storageBucket: "fir-system-5a87b.firebasestorage.app",
    messagingSenderId: "240923702550",
    appId: "1:240923702550:web:23ea3d84ed6817ce0f8c37"
};

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