import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    get, 
    update,
    query,
    orderByChild,
    equalTo 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import { 
    getStorage, 
    ref as sRef, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

/* 🔐 ROLE & IDENTITY CHECK */
const userRole = localStorage.getItem("userRole");
const loggedInOfficerId = localStorage.getItem("userPhone"); // Admin ne jo ID assign ki hai

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

/* 📄 FETCH ASSIGNED FIRs ONLY */
async function fetchAssignedFIRs() {
    try {
        const firsRef = ref(db, "FIRs");
        
        // ✅ Filter: Sirf wahi FIRs uthao jahan assignedOfficer == login wale ki ID
        const assignedQuery = query(
            firsRef, 
            orderByChild("assignedOfficer"), 
            equalTo(loggedInOfficerId)
        );

        const snapshot = await get(assignedQuery);

        if (!snapshot.exists()) {
            firListDiv.innerHTML = `
                <div style="text-align:center; padding: 50px;">
                    <i class="fas fa-folder-open" style="font-size: 50px; color: #ccc;"></i>
                    <p style="color: #666; margin-top: 15px;">No cases have been assigned to you yet.</p>
                </div>`;
            return;
        }

        firListDiv.innerHTML = "";

        snapshot.forEach(child => {
            const firId = child.key;
            const fir = child.val();

            const div = document.createElement("div");
            div.className = "fir-card";

            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h3>${fir.crime?.crimeType || "Unknown Crime"}</h3>
                    <span style="background: #0b3c5d; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px;">
                        ID: ${fir.firID}
                    </span>
                </div>

                <p><b>Victim:</b> ${fir.victim?.name || "N/A"} (${fir.victim?.phone || "N/A"})</p>
                <p><b>Location:</b> ${fir.crime?.location || "N/A"}</p>
                <p><b>Status:</b> <span style="color: ${fir.status === 'Approved' ? 'green' : 'orange'}">${fir.status || "Assigned"}</span></p>

                <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;">

                <label><b>Investigation Notes:</b></label>
                <textarea 
                    id="note-${firId}" 
                    style="width:100%; height:80px; margin-top:5px; padding:10px; border-radius:5px; border: 1px solid #ccc;"
                    placeholder="Update case progress..."
                >${fir.officerNotes || ""}</textarea>

                <div style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 10px;">
                    <button class="btn view" onclick="viewFIR('${firId}')">Full Details</button>
                    <button class="btn approve" onclick="updateStatus('${firId}', 'Approved')">Approve Case</button>
                    <button class="btn reject" onclick="updateStatus('${firId}', 'Rejected')">Reject Case</button>
                    <button class="btn" style="background: #555; color: white;" onclick="saveNotes('${firId}')">Save Notes</button>
                </div>

                <div style="margin-top: 20px; background: #f9f9f9; padding: 10px; border-radius: 5px;">
                    <label><b>Attach Evidence (Photos/Docs):</b></label><br>
                    <input type="file" id="file-${firId}" style="margin-top:5px;" />
                    <button class="btn" style="background: #0b3c5d; color: white; margin-top:10px;" onclick="uploadAttachment('${firId}')">
                        <i class="fas fa-upload"></i> Upload to Blockchain
                    </button>
                </div>
            `;

            firListDiv.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        firListDiv.innerHTML = "<p style='color:red;'>Error connecting to the blockchain records.</p>";
    }
}

/* 🔄 UPDATE FIR STATUS */
window.updateStatus = async function (firId, status) {
    if(!confirm(`Are you sure you want to mark this FIR as ${status}?`)) return;
    try {
        await update(ref(db, "FIRs/" + firId), { status: status });
        alert("Status updated to: " + status);
        fetchAssignedFIRs();
    } catch (err) { alert("Update failed."); }
};

/* 📝 SAVE OFFICER NOTES */
window.saveNotes = async function (firId) {
    const note = document.getElementById(`note-${firId}`).value;
    try {
        await update(ref(db, "FIRs/" + firId), { officerNotes: note });
        alert("Investigation notes updated.");
    } catch (err) { alert("Failed to save notes."); }
};

/* 📎 UPLOAD ATTACHMENT */
window.uploadAttachment = async function (firId) {
    const fileInput = document.getElementById(`file-${firId}`);
    const file = fileInput.files[0];

    if (!file) { alert("Please select a file first"); return; }

    try {
        const storageRef = sRef(storage, `FIR_Attachments/${firId}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await update(ref(db, `FIRs/${firId}/attachments/${Date.now()}`), {
            name: file.name,
            url: downloadURL
        });
        alert("Digital evidence uploaded successfully.");
    } catch (err) { alert("Upload failed."); }
};

/* 👁 VIEW FIR DETAILS */
window.viewFIR = function (firId) {
    localStorage.setItem("selectedFIR", firId);
    window.location.href = "fir-details.html";
};

/* 🚀 INITIAL LOAD */
fetchAssignedFIRs();