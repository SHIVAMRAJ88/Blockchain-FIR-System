import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCEp1wVblbrb7rY-gqMQyiJLcQVQteecq8",
    authDomain: "fir-system-5a87b.firebaseapp.com",
    projectId: "fir-system-5a87b",
    storageBucket: "fir-system-5a87b.firebasestorage.app",
    messagingSenderId: "240923702550",
    appId: "1:240923702550:web:23ea3d84ed6817ce0f8c37",
    measurementId: "G-Y9NEY5KTBP"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const firListDiv = document.getElementById("firList");

/**
 * ✅ Blockchain Verification Logic
 * Checks internal data integrity and the link to the previous FIR.
 */
async function verifyChainLink(fir, expectedPrevHash) {
    if (!fir.dataHash) return "OLD_RECORD";

    try {
        const secureData = {
            crime: {
                accused: fir.crime.accused,
                crimeType: fir.crime.crimeType,
                date: fir.crime.date,
                details: fir.crime.details,
                location: fir.crime.location,
                time: fir.crime.time
            },
            victim: {
                address: fir.victim.address,
                city: fir.victim.city,
                name: fir.victim.name,
                phone: fir.victim.phone,
                pincode: fir.victim.pincode,
                state: fir.victim.state
            },
            witness: {
                address: fir.witness.address,
                city: fir.witness.city,
                name: fir.witness.name,
                phone: fir.witness.phone,
                pincode: fir.witness.pincode,
                state: fir.witness.state
            },
            previousHash: fir.previousHash || "00000000000000000000000000000000"
        };

        const dataString = JSON.stringify(secureData);
        const msgUint8 = new TextEncoder().encode(dataString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const calculatedHash = Array.from(new Uint8Array(hashBuffer))
                            .map(b => b.toString(16).padStart(2, '0')).join('');

        // Check 1: Internal Integrity
        if (calculatedHash !== fir.dataHash) return "TAMPERED";

        // Check 2: Chain Connection
        if (expectedPrevHash && fir.previousHash !== expectedPrevHash) return "CHAIN_BROKEN";

        return "SECURE";
    } catch (err) {
        console.error("Integrity Check Error:", err);
        return "ERROR";
    }
}

/**
 * 📄 Fetch and Render FIRs
 */
async function fetchFIRs() {
    try {
        const snapshot = await get(ref(db, 'FIRs'));
        firListDiv.innerHTML = ""; // Clear loading message

        if (snapshot.exists()) {
            const allFIRs = snapshot.val();
            const loggedInPhone = localStorage.getItem("userPhone");
            let lastGlobalHash = null;

            // Sort by timestamp to verify the chain in chronological order
            const sortedKeys = Object.keys(allFIRs).sort((a, b) => allFIRs[a].timestamp - allFIRs[b].timestamp);

            for (const firKey of sortedKeys) {
                const fir = allFIRs[firKey];
                const integrity = await verifyChainLink(fir, lastGlobalHash);
                
                // Only show the FIR if it belongs to the logged-in user
                if (fir.victim?.phone === loggedInPhone) {
                    let status = { text: "✅ SECURE", color: "green", bg: "#e9f0ff" };
                    
                    if (integrity === "TAMPERED") {
                        status = { text: "⚠️ DATA TAMPERED", color: "red", bg: "#fff0f0" };
                    } else if (integrity === "CHAIN_BROKEN") {
                        status = { text: "🛑 CHAIN BROKEN", color: "orange", bg: "#fff9f0" };
                    } else if (integrity === "OLD_RECORD") {
                        status = { text: "❓ NO HASH", color: "gray", bg: "#f9f9f9" };
                    }

                    const firItem = document.createElement("div");
                    firItem.className = "fir-box";
                    firItem.style.borderLeft = `6px solid ${status.color}`;
                    firItem.style.background = status.bg;
                    firItem.style.padding = "15px";
                    firItem.style.marginBottom = "10px";
                    firItem.style.borderRadius = "8px";
                    firItem.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";

                    firItem.innerHTML = `
                        <div style="float:right; color:${status.color}; font-weight:bold;">${status.text}</div>
                        <h3>${fir.crime?.crimeType || "Report"}</h3>
                        <p><strong>FIR ID:</strong> ${fir.firID}</p>
                        <p><small>Blockchain Link: ${fir.previousHash ? fir.previousHash.substring(0,12) + "..." : "Genesis Block"}</small></p>
                        
                        <button onclick="window.location.href='fir-details.html?id=${fir.firID}'" 
                                style="padding: 8px 15px; cursor: pointer; background: #1a73e8; color: white; border: none; border-radius: 4px;">
                            View Details
                        </button>
                    `;
                    firListDiv.appendChild(firItem);
                }
                // Store this block's hash as the 'previous' for the next iteration
                lastGlobalHash = fir.dataHash; 
            }
        } else {
            firListDiv.innerHTML = "<li>No FIRs found in the database.</li>";
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        firListDiv.innerHTML = "<li>Error loading data. Check console for details.</li>";
    }
}

// Initial Call
fetchFIRs();