
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

// ✅ 1. Safe ID Retrieval: Dashboard ('id') aur Homepage ('hash') dono ko handle karega
const urlParams = new URLSearchParams(window.location.search);
const targetId = urlParams.get('hash') || urlParams.get('id'); 

if (!targetId) {
    firDetailsDiv.innerHTML = "<p style='color: #ff7675;'>Error: No FIR ID or Hash provided.</p>";
} else {
    loadFIRDetails();
}

async function loadFIRDetails() {
    try {
        // ✅ 2. Querying the 'FIRs' node
        const firsRef = ref(db, "FIRs");
        const firQuery = query(firsRef, orderByChild("firID"), equalTo(targetId));
        const snapshot = await get(firQuery);

        if (!snapshot.exists()) {
            firDetailsDiv.innerHTML = "<h2 style='color: #fff;'>FIR not found in the blockchain records.</h2>";
            return;
        }

        const data = snapshot.val();
        const key = Object.keys(data)[0];
        const fir = data[key];

        // ✅ 3. Render Details with Visibility Fix (Dark Theme Optimized)
        // Isse white background wala issue solve ho jayega
        firDetailsDiv.innerHTML = `
            <h2 style="color: #a29bfe; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                <i class="fas fa-file-alt"></i> ${fir.crime?.crimeType || "Crime Report"}
            </h2>
            
            <div style="background: rgba(0, 0, 0, 0.4); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 25px;">
                <p style="color: #a29bfe; font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">FIR ID</p>
                <p style="color: #fff; font-size: 16px; margin-bottom: 15px; font-weight: 600;">${fir.firID}</p>
                
                <p style="color: #a29bfe; font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Status</p>
                <p style="color: #fff; font-size: 16px; margin-bottom: 15px;">${fir.status || "Filed"}</p>
                
                <p style="color: #a29bfe; font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Blockchain Hash</p>
                <p style="color: #2ed573; font-family: monospace; font-size: 12px; word-break: break-all; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 5px;">
                    ${fir.dataHash}
                </p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h3 style="color: #a29bfe; font-size: 14px; margin-bottom: 10px;"><i class="fas fa-map-marker-alt"></i> Incident Info</h3>
                    <p style="margin: 0; color: #ccc; font-size: 13px;">Location:</p>
                    <p style="color: #fff; margin-bottom: 10px;">${fir.crime?.location || "N/A"}</p>
                    <p style="margin: 0; color: #ccc; font-size: 13px;">Details:</p>
                    <p style="color: #fff;">${fir.crime?.details || "N/A"}</p>
                </div>
                
                <div>
                    <h3 style="color: #a29bfe; font-size: 14px; margin-bottom: 10px;"><i class="fas fa-user"></i> Victim Info</h3>
                    <p style="margin: 0; color: #ccc; font-size: 13px;">Name:</p>
                    <p style="color: #fff; margin-bottom: 10px;">${fir.victim?.name || "N/A"}</p>
                    <p style="margin: 0; color: #ccc; font-size: 13px;">Contact:</p>
                    <p style="color: #fff;">${fir.victim?.phone || "No Contact Stored"}</p>
                </div>
            </div>

            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;">
            
            <h3 style="color: #a29bfe; font-size: 14px; margin-bottom: 10px;"><i class="fas fa-gavel"></i> Officer Actions</h3>
            <div style="background: rgba(108, 92, 231, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #6c5ce7;">
                <p style="margin: 0; color: #eee; font-style: italic;">
                    ${fir.officerNotes || "Waiting for official police review and digital signature..."}
                </p>
            </div>
        `;

        loadEvidences(targetId);

    } catch (err) {
        console.error(err);
        firDetailsDiv.innerHTML = "<p style='color: #ff7675;'>Error: Could not verify record integrity.</p>";
    }
}

async function loadEvidences(id) {
    const evRef = ref(db, `evidences/${id}`);
    const snap = await get(evRef);
    evidenceList.innerHTML = "";

    if (snap.exists()) {
        const ev = snap.val();
        const li = document.createElement("li");
        li.style.cssText = "background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.1); list-style: none;";
        li.innerHTML = `
            <div style="color: #a29bfe; font-size: 12px; margin-bottom: 5px;">ATTACHED FILE</div>
            <b style="color: #fff;">${ev.fileName}</b><br>
            <div style="color: #a29bfe; font-size: 12px; margin-top: 10px;">SHA-256 VERIFIED HASH</div>
            <code style="word-break:break-all; color: #2ed573; font-size: 11px;">${ev.hash}</code>
        `;
        evidenceList.appendChild(li);
    } else {
        evidenceList.innerHTML = "<li style='color: #888; list-style: none;'>No digital evidence attached to this blockchain record.</li>";
    }
}