import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEp1wVblbrb7rY-gqMQyiJLcQVQteecq8",
  authDomain: "fir-system-5a87b.firebaseapp.com",
  databaseURL: "https://fir-system-5a87b-default-rtdb.firebaseio.com", 
  projectId: "fir-system-5a87b",
  storageBucket: "fir-system-5a87b.appspot.com", // ⚠️ Corrected
  messagingSenderId: "240923702550",
  appId: "1:240923702550:web:23ea3d84ed6817ce0f8c37"
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
