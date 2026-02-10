import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCEp1wVblbrb7rY-gqMQyiJLcQVQteecq8",
    authDomain: "fir-system-5a87b.firebaseapp.com",
    projectId: "fir-system-5a87b",
    storageBucket: "fir-system-5a87b.firebasestorage.app",
    messagingSenderId: "240923702550",
    appId: "1:240923702550:web:23ea3d84ed6817ce0f8c37"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const firDetailsDiv = document.getElementById("firDetails");
const evidenceList = document.getElementById("evidenceList");

// ✅ 1. Get FIR ID from URL
const urlParams = new URLSearchParams(window.location.search);
const targetId = urlParams.get('id'); 

if (!targetId) {
    firDetailsDiv.innerHTML = "<p>Error: No FIR ID provided.</p>";
} else {
    loadFIRDetails();
}

async function loadFIRDetails() {
    try {
        // ✅ 2. Query the 'FIRs' node for the specific firID
        const firsRef = ref(db, "FIRs");
        const firQuery = query(firsRef, orderByChild("firID"), equalTo(targetId));
        const snapshot = await get(firQuery);

        if (!snapshot.exists()) {
            firDetailsDiv.innerHTML = "<p>FIR not found in the blockchain records.</p>";
            return;
        }

        // Extract the data from the query result
        const data = snapshot.val();
        const key = Object.keys(data)[0];
        const fir = data[key];

        // ✅ 3. Render Details
        firDetailsDiv.innerHTML = `
            <h2>${fir.crime?.crimeType || "Report"}</h2>
            <div style="background: #f4f4f4; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                <p><strong>FIR ID:</strong> ${fir.firID}</p>
                <p><strong>Status:</strong> ${fir.status || "Filed"}</p>
                <p><strong>Blockchain Hash:</strong> <small>${fir.dataHash}</small></p>
            </div>

            <h3>Crime Scene Info</h3>
            <p><strong>Location:</strong> ${fir.crime?.location || "N/A"}</p>
            <p><strong>Details:</strong> ${fir.crime?.details || "N/A"}</p>

            <h3>Victim Details</h3>
            <p><strong>Name:</strong> ${fir.victim?.name || "N/A"}</p>
            <p><strong>Contact:</strong> ${fir.victim?.phone || "N/A"}</p>

            <hr>
            <h3>Officer Actions</h3>
            <p>${fir.officerNotes || "Waiting for officer review..."}</p>
        `;

        // Load evidence using the same ID
        loadEvidences(targetId);

    } catch (err) {
        console.error(err);
        firDetailsDiv.innerHTML = "<p>Error: Could not verify record integrity.</p>";
    }
}

async function loadEvidences(id) {
    // Note: This matches your evidence2.js storage structure
    const evRef = ref(db, `evidences/${id}`);
    const snap = await get(evRef);
    evidenceList.innerHTML = "";

    if (snap.exists()) {
        const ev = snap.val();
        const li = document.createElement("li");
        li.innerHTML = `
            <b>File:</b> ${ev.fileName}<br>
            <b>SHA-256 Hash:</b> <code style="word-break:break-all;">${ev.hash}</code>
        `;
        evidenceList.appendChild(li);
    } else {
        evidenceList.innerHTML = "<li>No digital evidence attached.</li>";
    }
}