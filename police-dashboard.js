// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getDatabase, ref, get, update } 
// from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// /* 🔐 ROLE SECURITY CHECK */
// const userRole = localStorage.getItem("userRole");

// if (!userRole || userRole !== "police") {
//     alert("Unauthorized access");
//     window.location.href = "login.html";
// }

// /* 🔥 Firebase Config */
// const firebaseConfig = {
//     apiKey: "AIzaSyCEp1wVblbrb7rY-gqMQyiJLcQVQteecq8",
//     authDomain: "fir-system-5a87b.firebaseapp.com",
//     databaseURL: "https://fir-system-5a87b-default-rtdb.firebaseio.com",
//     projectId: "fir-system-5a87b",
//     storageBucket: "fir-system-5a87b.appspot.com",
//     messagingSenderId: "240923702550",
//     appId: "1:240923702550:web:23ea3d84ed6817ce0f8c37"
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// const firListDiv = document.getElementById("firList");

// /* 📄 FETCH ALL FIRs */
// async function fetchAllFIRs() {
//     try {
//         const firRef = ref(db, "FIRs");
//         const snapshot = await get(firRef);

//         if (!snapshot.exists()) {
//             firListDiv.innerHTML = "<p>No FIRs found.</p>";
//             return;
//         }

//         firListDiv.innerHTML = "";

//         snapshot.forEach(child => {
//             const firId = child.key;
//             const fir = child.val();

//             const div = document.createElement("div");
//             div.className = "fir-card";

//             div.innerHTML = `
//                 <h3>${fir.crime?.crimeType || "Unknown Crime"}</h3>
//                 <p><b>Victim:</b> ${fir.victim?.name || "N/A"} (${fir.victim?.phone || "N/A"})</p>
//                 <p><b>Location:</b> ${fir.crime?.location || "N/A"}</p>
//                 <p><b>Status:</b> ${fir.status || "Pending"}</p>

//                 <button class="btn view" onclick="viewFIR('${firId}')">View</button>
//                 <button class="btn approve" onclick="updateStatus('${firId}', 'Approved')">Approve</button>
//                 <button class="btn reject" onclick="updateStatus('${firId}', 'Rejected')">Reject</button>
//             `;

//             firListDiv.appendChild(div);
//         });

//     } catch (err) {
//         console.error(err);
//         firListDiv.innerHTML = "<p>Error loading FIRs</p>";
//     }
// }

// /* 🔄 UPDATE FIR STATUS */
// window.updateStatus = async function (firId, status) {
//     try {
//         await update(ref(db, "FIRs/" + firId), {
//             status: status
//         });
//         alert("FIR " + status);
//         fetchAllFIRs();
//     } catch (err) {
//         alert("Error updating FIR");
//     }
// };

// /* 👁 VIEW FIR DETAILS */
// window.viewFIR = function (firId) {
//     localStorage.setItem("selectedFIR", firId);
//     window.location.href = "fir-details.html";
// };

// fetchAllFIRs();




import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    get, 
    update 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import { 
    getStorage, 
    ref as sRef, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

/* 🔐 ROLE SECURITY CHECK */
const userRole = localStorage.getItem("userRole");

if (!userRole || userRole !== "police") {
    alert("Unauthorized access");
    window.location.href = "login.html";
}

/* 🔥 Firebase Config */
const firebaseConfig = {
    apiKey: "AIzaSyCEp1wVblbrb7rY-gqMQyiJLcQVQteecq8",
    authDomain: "fir-system-5a87b.firebaseapp.com",
    databaseURL: "https://fir-system-5a87b-default-rtdb.firebaseio.com",
    projectId: "fir-system-5a87b",
    storageBucket: "fir-system-5a87b.appspot.com",
    messagingSenderId: "240923702550",
    appId: "1:240923702550:web:23ea3d84ed6817ce0f8c37"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

const firListDiv = document.getElementById("firList");

/* 📄 FETCH ALL FIRs */
async function fetchAllFIRs() {
    try {
        const firRef = ref(db, "FIRs");
        const snapshot = await get(firRef);

        if (!snapshot.exists()) {
            firListDiv.innerHTML = "<p>No FIRs found.</p>";
            return;
        }

        firListDiv.innerHTML = "";

        snapshot.forEach(child => {
            const firId = child.key;
            const fir = child.val();

            const div = document.createElement("div");
            div.className = "fir-card";

            div.innerHTML = `
                <h3>${fir.crime?.crimeType || "Unknown Crime"}</h3>

                <p><b>Victim:</b> ${fir.victim?.name || "N/A"} 
                (${fir.victim?.phone || "N/A"})</p>

                <p><b>Location:</b> ${fir.crime?.location || "N/A"}</p>
                <p><b>Status:</b> ${fir.status || "Pending"}</p>

                <label><b>Officer Notes:</b></label>
                <textarea 
                    id="note-${firId}" 
                    style="width:100%;height:60px;"
                    placeholder="Write investigation notes here..."
                >${fir.officerNotes || ""}</textarea>

                <br><br>

                <label><b>Upload Attachment:</b></label>
                <input type="file" id="file-${firId}" />

                <br><br>

                <button class="btn view" onclick="viewFIR('${firId}')">View</button>
                <button class="btn approve" onclick="updateStatus('${firId}', 'Approved')">Approve</button>
                <button class="btn reject" onclick="updateStatus('${firId}', 'Rejected')">Reject</button>
                <button class="btn" onclick="saveNotes('${firId}')">Save Notes</button>
                <button class="btn" onclick="uploadAttachment('${firId}')">Upload File</button>
            `;

            firListDiv.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        firListDiv.innerHTML = "<p>Error loading FIRs</p>";
    }
}

/* 🔄 UPDATE FIR STATUS */
window.updateStatus = async function (firId, status) {
    try {
        await update(ref(db, "FIRs/" + firId), {
            status: status
        });
        alert("FIR " + status);
        fetchAllFIRs();
    } catch (err) {
        alert("Error updating FIR");
    }
};

/* 📝 SAVE OFFICER NOTES */
window.saveNotes = async function (firId) {
    const note = document.getElementById(`note-${firId}`).value;

    try {
        await update(ref(db, "FIRs/" + firId), {
            officerNotes: note
        });
        alert("Notes saved successfully");
    } catch (err) {
        alert("Error saving notes");
    }
};

/* 📎 UPLOAD ATTACHMENT */
window.uploadAttachment = async function (firId) {
    const fileInput = document.getElementById(`file-${firId}`);
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file first");
        return;
    }

    try {
        const storageRef = sRef(
            storage, 
            `FIR_Attachments/${firId}/${Date.now()}_${file.name}`
        );

        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await update(ref(db, `FIRs/${firId}/attachments/${Date.now()}`), {
            name: file.name,
            url: downloadURL
        });

        alert("Attachment uploaded successfully");

    } catch (err) {
        console.error(err);
        alert("File upload failed");
    }
};

/* 👁 VIEW FIR DETAILS */
window.viewFIR = function (firId) {
    localStorage.setItem("selectedFIR", firId);
    window.location.href = "fir-details.html";
};

/* 🚀 INITIAL LOAD */
fetchAllFIRs();
