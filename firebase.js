import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } 
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getDatabase } 
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyCEp1wVblbrb7rY-gqMQyiJLcQVQteecq8",
  authDomain: "fir-system-5a87b.firebaseapp.com",
  projectId: "fir-system-5a87b",
  storageBucket: "fir-system-5a87b.firebasestorage.app",
  messagingSenderId: "240923702550",
  appId: "1:240923702550:web:23ea3d84ed6817ce0f8c37",
  measurementId: "G-Y9NEY5KTBP"
};

const app = initializeApp(firebaseConfig);//
const auth = getAuth(app);


const db = getDatabase(app);
export { auth,db };

//
window.addEventListener("DOMContentLoaded", () => {
  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
      size: "normal",
      callback: () => {
        console.log("Recaptcha Verified ");
      },
      "expired-callback": () => {
        console.log("Recaptcha Expired ");
      }
    }
  );

  window.recaptchaVerifier.render().then(() => {
    console.log("Recaptcha Rendered ");
  });
});


// Send OTP
document.getElementById("sendOTP").addEventListener("click", () => {
  const phone = document.getElementById("phone").value.trim();
  if (!/^\d{10}$/.test(phone)) {
    document.getElementById("error").textContent = "Invalid phone number";
    return;
  }

  const fullPhone = "+91" + phone;
  const appVerifier = window.recaptchaVerifier;

  signInWithPhoneNumber(auth, fullPhone, appVerifier)
    .then(confirmationResult => {
      window.confirmationResult = confirmationResult;
      const otpMessage = document.getElementById("otp-message");
      otpMessage.style.color = "green";
      otpMessage.textContent = "OTP Sent!";
    })
    .catch(error => {
      const otpMessage = document.getElementById("otp-message");
      otpMessage.style.color = "red";
      otpMessage.textContent = error.message;
      console.error(error);
    });
});

// Verify OTP
document.getElementById("verifyOTP").addEventListener("click", () => {
  const otp = document.getElementById("otp").value.trim();
  if (!otp) {
    document.getElementById("otp-message").textContent = "Enter OTP";
    return;
  }

  window.confirmationResult.confirm(otp)
    .then(result => {
      const otpMessage = document.getElementById("otp-message");
      otpMessage.style.color = "green";
      otpMessage.textContent = "OTP Verified!";
      document.getElementById("createAccount").disabled = false;
    })
    .catch(error => {
      const otpMessage = document.getElementById("otp-message");
      otpMessage.style.color = "red";
      otpMessage.textContent = "Invalid OTP!";
      console.error(error);
    });
});
