// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, get } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


// Firebase config                                  


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

const auth = getAuth(app);
const db = getDatabase(app);

// Recaptcha
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sendOTP', { size: 'invisible' });

let confirmationResult;
let otpVerified = false;

//  Send OTP
document.getElementById("sendOTP").addEventListener("click", () => {
  const phone = "+91" + document.getElementById("phone").value.trim();
  if (!phone) return alert("Enter phone number");

  signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      otpVerified = false; // reset
      alert("✅ OTP Sent Successfully");
    })
    .catch((err) => {
      console.log(err);
      document.getElementById("error").innerText = err.message;
    });
});

// Verify OTP
document.getElementById("verifyOTP").addEventListener("click", () => {
  const otp = document.getElementById("otp").value.trim();
  if (!otp || !confirmationResult) {
    document.getElementById("error").innerText = "❌ Please send OTP first or enter OTP";
    return;
  }

  confirmationResult.confirm(otp)
    .then(() => {
      otpVerified = true;
      alert("✅ OTP Verified Successfully");
      document.getElementById("error").innerText = ""; // clear errors
    })
    .catch(() => {
      otpVerified = false;
      document.getElementById("error").innerText = "❌ Wrong OTP";
    });
});

//  Login
document.getElementById("loginBtn").addEventListener("click", async () => {
  if (!otpVerified) {
    document.getElementById("error").innerText = "❌ Please verify OTP first";
    return;
  }

  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const fullname = document.getElementById("FullName").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!phone || !email || !fullname || !password) {
    document.getElementById("error").innerText = " All fields are required";
    return;
  }

  try {
    const phoneForDB = document.getElementById("phone").value.trim();
    const userRef = ref(db, "users/" + phoneForDB);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      document.getElementById("error").innerText = " User Not Found";
      return;
    }

    const userData = snapshot.val();

    if (!userData.email || userData.email.toLowerCase() !== email.toLowerCase()) {
      document.getElementById("error").innerText = " Invalid Email";
      return;
    }

    if (!userData.fullname || userData.fullname.toLowerCase() !== fullname.toLowerCase()) {
      document.getElementById("error").innerText = " Invalid Username";
      return;
    }

    if (userData.password !== password) {
      document.getElementById("error").innerText = " Invalid Password";
      return;
    }

    //  Successful login
    alert("Login Successful");
   
    // login.js (jab login successful ho jaye)
  // localStorage.setItem("user?", phoneInput.value.trim());


    // //NEW LINE YAHI ADD KIYE HAI
    localStorage.setItem("userPhone", phoneForDB);
    localStorage.setItem("userRole", userData.role);

   if (userData.role === "police") {
    window.location.href = "police-dashboard.html";
  } else {
    window.location.href = "fir.html";
}
  } catch (err) {
    console.log(err);
    document.getElementById("error").innerText = "❌ Something went wrong";
  }
});
