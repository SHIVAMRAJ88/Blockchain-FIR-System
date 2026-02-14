import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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




const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const fileInput = document.getElementById("evidenceFile");

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  const storageReference = storageRef(storage, 'testUploads/' + file.name);

  try {
    await uploadBytes(storageReference, file);
    const url = await getDownloadURL(storageReference);
    console.log("File uploaded! Download URL:", url);
  } catch (err) {
    console.error("Upload error:", err);
  }
});
