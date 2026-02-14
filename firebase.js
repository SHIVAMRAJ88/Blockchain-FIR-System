

import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } 
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set } from "firebase/database";





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
