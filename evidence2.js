import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEp1wVblbrb7rY-gqMQyiJLcQVQteecq8",
  authDomain: "fir-system-5a87b.firebaseapp.com",
  databaseURL: "https://fir-system-5a87b-default-rtdb.firebaseio.com", 
  projectId: "fir-system-5a87b",
  storageBucket: "fir-system-5a87b.firebasestorage.app",
  messagingSenderId: "240923702550",
  appId: "1:240923702550:web:23ea3d84ed6817ce0f8c37"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);



    const evidenceForm = document.getElementById("evidenceForm");
    const fileInput = document.getElementById("evidenceFile");
    const hashResult = document.getElementById("hashResult");

    evidenceForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const file = fileInput.files[0];
      const firId = document.getElementById("firID").value;
      const desc = document.getElementById("evidenceDesc").value;

      if (!file) {
        alert("Please select a file");
        return;
      }

      // ✅ Convert File to ArrayBuffer
      const buffer = await file.arrayBuffer();

      // ✅ Generate SHA-256 Hash
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      // ✅ Display Hash
      hashResult.innerHTML = `
        ✅ Evidence Uploaded Successfully! <br><br>
        <b>FIR ID:</b> ${firId} <br>
        <b>SHA-256 Hash:</b><br>${hashHex}
      `;

      // ✅ (Future Use) — Firebase Store Ready Object
      const evidenceData = {
        firId: firId,
        description: desc,
        fileName: file.name,
        hash: hashHex,
        time: new Date().toISOString()
      };

     // ✅ Store in Firebase
  set(ref(db, 'evidences/' + firId), evidenceData)
    .then(() => {
      hashResult.innerHTML = `
        ✅ Evidence Stored Successfully! <br><br>
        <b>FIR ID:</b> ${firId} <br>
        <b>File Name:</b> ${file.name} <br>
        <b>SHA-256 Hash:</b><br>${hashHex}
      `;
    })
    .catch(err => {
      alert("❌ Error storing evidence: " + err.message);
    });

  evidenceForm.reset();
});



// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// // Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyCEp1wVblbrb7rY-gqMQyiJLcQVQteecq8",
//   authDomain: "fir-system-5a87b.firebaseapp.com",
//   databaseURL: "https://fir-system-5a87b-default-rtdb.firebaseio.com", 
//   projectId: "fir-system-5a87b",
//   storageBucket: "fir-system-5a87b.firebasestorage.app",
//   messagingSenderId: "240923702550",
//   appId: "1:240923702550:web:23ea3d84ed6817ce0f8c37"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// // DOM elements
// const evidenceForm = document.getElementById("evidenceForm");
// const firIDInput = document.getElementById("firID");
// const evidenceFileInput = document.getElementById("evidenceFile");
// const evidenceDescInput = document.getElementById("evidenceDesc");
// const hashResultDiv = document.getElementById("hashResult");

// // Helper function: Generate SHA-256 hash
// async function generateHash(file) {
//     const arrayBuffer = await file.arrayBuffer();
//     const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
//     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
//     return hashHex;
// }

// // Handle form submission
// evidenceForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const firID = firIDInput.value.trim();
//     const file = evidenceFileInput.files[0];
//     const description = evidenceDescInput.value.trim();

//     if (!firID || !file || !description) {
//         alert("❌ Please fill all fields and select a file");
//         return;
//     }

//     try {
//         // Generate hash
//         const hash = await generateHash(file);

//         // Save to Firebase
//         const evidenceRef = ref(db, "evidences");
//         const newEvidenceRef = push(evidenceRef);
//         await set(newEvidenceRef, {
//             firId: firID,
//             fileName: file.name,
//             description: description,
//             hash: hash,
//             time: new Date().toISOString()
//         });

//         hashResultDiv.innerHTML = `
//             ✅ Evidence uploaded successfully! <br>
//             <strong>SHA-256 Hash:</strong> ${hash}
//         `;

//         // Reset form
//         evidenceForm.reset();

//     } catch (err) {
//         console.error(err);
//         alert("❌ Error uploading evidence. See console for details.");
//     }
// });


// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getDatabase, ref, push, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// // Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyCEp1wVblbrb7rY-gqMQyiJLcQVQteecq8",
//   authDomain: "fir-system-5a87b.firebaseapp.com",
//   databaseURL: "https://fir-system-5a87b-default-rtdb.firebaseio.com", 
//   projectId: "fir-system-5a87b",
//   storageBucket: "fir-system-5a87b.firebasestorage.app",
//   messagingSenderId: "240923702550",
//   appId: "1:240923702550:web:23ea3d84ed6817ce0f8c37"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// // DOM elements
// const evidenceForm = document.getElementById("evidenceForm");
// const firIDInput = document.getElementById("firID");
// const evidenceFileInput = document.getElementById("evidenceFile");
// const evidenceDescInput = document.getElementById("evidenceDesc");
// const hashResultDiv = document.getElementById("hashResult");

// Get logged-in user info
// const loggedInPhone = localStorage.getItem("userPhone");
// const userRole = localStorage.getItem("userRole"); // "citizen" or "police"

// // Helper function: Generate SHA-256 hash
// async function generateHash(file) {
//     const arrayBuffer = await file.arrayBuffer();
//     const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
//     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
//     return hashHex;
// }

// // Handle form submission
// evidenceForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const firID = firIDInput.value.trim();
//     const file = evidenceFileInput.files[0];
//     const description = evidenceDescInput.value.trim();

//     if (!firID || !file || !description) {
//         alert("❌ Please fill all fields and select a file");
//         return;
//     }

//     try {
//         // Citizen role: verify FIR belongs to them
//         if(userRole === "citizen") {
//             const firRef = ref(db, "FIRs/" + firID);
//             const snapshot = await get(firRef);

//             if(!snapshot.exists()) {
//                 alert("❌ FIR ID not found");
//                 return;
//             }

//             const fir = snapshot.val();
//             if(fir.victim?.phone !== loggedInPhone) {
//                 alert("❌ You can only upload evidence for your own FIRs");
//                 return;
//             }
//         }

//         // Generate hash
//         const hash = await generateHash(file);

//         // Save evidence to Firebase
//         const evidenceRef = ref(db, "evidences");
//         const newEvidenceRef = push(evidenceRef);
//         await set(newEvidenceRef, {
//             firId: firID,
//             fileName: file.name,
//             description: description,
//             hash: hash,
//             time: new Date().toISOString()
//         });

//         hashResultDiv.innerHTML = `
//             ✅ Evidence uploaded successfully! <br>
//             <strong>SHA-256 Hash:</strong> ${hash}
//         `;

//         // Reset form
//         evidenceForm.reset();

//     } catch (err) {
//         console.error(err);
//         alert("❌ Error uploading evidence. Check console for details.");
//     }
// });






// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getDatabase, ref, push, set, get, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// // Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyCEp1wVblbrb7rY-gqMQyiJLcQVQteecq8",
//   authDomain: "fir-system-5a87b.firebaseapp.com",
//   databaseURL: "https://fir-system-5a87b-default-rtdb.firebaseio.com", 
//   projectId: "fir-system-5a87b",
//   storageBucket: "fir-system-5a87b.firebasestorage.app",
//   messagingSenderId: "240923702550",
//   appId: "1:240923702550:web:23ea3d84ed6817ce0f8c37"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// // DOM elements
// const evidenceForm = document.getElementById("evidenceForm");
// const firIDInput = document.getElementById("firID");
// const evidenceFileInput = document.getElementById("evidenceFile");
// const evidenceDescInput = document.getElementById("evidenceDesc");
// const hashResultDiv = document.getElementById("hashResult");

// // Logged-in user info
// const loggedInPhone = localStorage.getItem("userPhone");
// const userRole = localStorage.getItem("userRole"); // "citizen" or "police"

// // Helper function: Generate SHA-256 hash
// async function generateHash(file) {
//     const arrayBuffer = await file.arrayBuffer();
//     const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
//     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
// }

// // Handle form submission
// evidenceForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const firID = firIDInput.value.trim();
//     const file = evidenceFileInput.files[0];
//     const description = evidenceDescInput.value.trim();

//     if (!firID || !file || !description) {
//         alert("❌ Please fill all fields and select a file");
//         return;
//     }

//     try {
//         // Query FIR by firID field inside push keys
//         const firQuery = query(ref(db, "FIRs"), orderByChild("firID"), equalTo(firID));
//         const snapshot = await get(firQuery);

//         if (!snapshot.exists()) {
//             alert(`❌ FIR ID "${firID}" not found`);
//             return;
//         }

//         // Get the first matched FIR data
//         const firData = Object.values(snapshot.val())[0];

//         // Citizen role: check if FIR belongs to them
//         if (userRole?.toLowerCase() === "citizen") {
//             if (firData.victim?.phone !== loggedInPhone) {
//                 alert("❌ You can only upload evidence for your own FIRs");
//                 return;
//             }
//         }

//         // Generate SHA-256 hash of the file
//         const hash = await generateHash(file);

//         // Save evidence to Firebase
//         const evidenceRef = ref(db, "evidences");
//         const newEvidenceRef = push(evidenceRef);
//         await set(newEvidenceRef, {
//             firId: firID,
//             fileName: file.name,
//             description: description,
//             hash: hash,
//             time: new Date().toISOString()
//         });

//         hashResultDiv.innerHTML = `
//             ✅ Evidence uploaded successfully! <br>
//             <strong>SHA-256 Hash:</strong> ${hash}
//         `;

//         // Reset form
//         evidenceForm.reset();

//     } catch (err) {
//         console.error(err);
//         alert("❌ Error uploading evidence. Check console for details.");
//     }
// });

