import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

// --- METAMASK LOGIN LOGIC ---
export async function loginWithMetaMask() {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0].toLowerCase();

        const userRef = ref(db, `users/${walletAddress}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            finalizeLogin(walletAddress, userData.fullname, userData.role || "citizen");
        } else {
            const fullName = prompt("New Wallet Detected! Please enter your Full Name to register:");
            if (!fullName) return;

            const newUser = {
                fullname: fullName,
                walletAddress: walletAddress,
                role: "citizen",
                registeredAt: Date.now()
            };

            await set(userRef, newUser);
            finalizeLogin(walletAddress, fullName, "citizen");
        }
    } catch (error) {
        console.error("MetaMask Error:", error);
    }
}

// --- STANDARD LOGIN LOGIC ---
function handleTraditionalLogin() {
    const name = document.getElementById("FullName").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!name || !phone || !email || !password) {
        document.getElementById("error").innerText = "Please fill all required fields";
        return;
    }

    finalizeLogin(phone, name, "citizen");
}

function finalizeLogin(id, name, role) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userPhone", id);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", name);
    window.location.href = "fir.html";
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    const mmBtn = document.getElementById("metamaskBtn");
    const loginBtn = document.getElementById("loginBtn");

    if (mmBtn) mmBtn.addEventListener("click", loginWithMetaMask);
    if (loginBtn) loginBtn.addEventListener("click", handleTraditionalLogin);
});