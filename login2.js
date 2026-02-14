import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getDatabase, ref, get } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);

window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sendOTP', {
  size: 'invisible'
});

let confirmationResult;
 // global

// 1️⃣ Send OTP
document.getElementById("sendOTP").addEventListener("click", () => {
  let phone = "+91" + document.getElementById("phone").value.trim();
  
  signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      alert("✅ OTP Sent Successfully");
    })
    .catch((error) => {
      document.getElementById("error").innerText = error.message;
    });
});

// 2️⃣ Verify OTP
document.getElementById("verifyOTP").addEventListener("click", () => {
  let otp = document.getElementById("otp").value.trim();
  
  if (!otp || !confirmationResult) {
    document.getElementById("error").innerText = "❌ Please send OTP first or enter OTP";
    return;
  }

  confirmationResult.confirm(otp)
    .then(() => {
      alert("✅ OTP Verified Successfully");
    })
    .catch(() => {
      document.getElementById("error").innerText = "❌ Wrong OTP";
    });
});

// 3️⃣ Login (Password + Database check)
document.getElementById("loginBtn").addEventListener("click", () => {
  let phone = document.getElementById("phone").value.trim();
  let email = document.getElementById("email").value.trim();
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value.trim();

  if (!phone || !password || !username || !email) {
    document.getElementById("error").innerText = "❌ All fields are required";
    return;
  }

  const userRef = ref(db, "users/" + phone);

  get(userRef).then((snapshot) => {
    if (!snapshot.exists()) {
      document.getElementById("error").innerText = "❌ User Not Found";
      return;
    }
    
    const userData = snapshot.val();

if (userData.email !== email) {
      document.getElementById("error").innerText = "❌ Invalid Email";
      return;
    }

    if (userData.username !== username) {
      document.getElementById("error").innerText = "❌ Invalid Username";
      return;
    }

    if (snapshot.val().password === password) {
      alert("✅ Login Successful");
       window.location.href = "fir.html"; 
    } else {
      document.getElementById("error").innerText = "❌ Invalid Password";
    }
  });
});

