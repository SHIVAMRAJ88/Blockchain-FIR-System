// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, get } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


// Firebase config                                  


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
