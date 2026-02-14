// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyCEp1wVblbrb7rY-gqMQyiJLcQVQteecq8",
//     authDomain: "fir-system-5a87b.firebaseapp.com",
//     projectId: "fir-system-5a87b",
//     storageBucket: "fir-system-5a87b.firebasestorage.app",
//     messagingSenderId: "240923702550",
//     appId: "1:240923702550:web:23ea3d84ed6817ce0f8c37",
//     measurementId: "G-Y9NEY5KTBP"
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);
// const firListDiv = document.getElementById("firList");

// /**
//  * ✅ Blockchain Verification Logic
//  * Checks internal data integrity and the link to the previous FIR.
//  */
// async function verifyChainLink(fir, expectedPrevHash) {
//     if (!fir.dataHash) return "OLD_RECORD";

//     try {
//         const secureData = {
//             crime: {
//                 accused: fir.crime.accused,
//                 crimeType: fir.crime.crimeType,
//                 date: fir.crime.date,
//                 details: fir.crime.details,
//                 location: fir.crime.location,
//                 time: fir.crime.time
//             },
//             victim: {
//                 address: fir.victim.address,
//                 city: fir.victim.city,
//                 name: fir.victim.name,
//                 phone: fir.victim.phone,
//                 pincode: fir.victim.pincode,
//                 state: fir.victim.state
//             },
//             witness: {
//                 address: fir.witness.address,
//                 city: fir.witness.city,
//                 name: fir.witness.name,
//                 phone: fir.witness.phone,
//                 pincode: fir.witness.pincode,
//                 state: fir.witness.state
//             },
//             previousHash: fir.previousHash || "00000000000000000000000000000000"
//         };

//         const dataString = JSON.stringify(secureData);
//         const msgUint8 = new TextEncoder().encode(dataString);
//         const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
//         const calculatedHash = Array.from(new Uint8Array(hashBuffer))
//                             .map(b => b.toString(16).padStart(2, '0')).join('');

//         // Check 1: Internal Integrity
//         if (calculatedHash !== fir.dataHash) return "TAMPERED";

//         // Check 2: Chain Connection
//         if (expectedPrevHash && fir.previousHash !== expectedPrevHash) return "CHAIN_BROKEN";

//         return "SECURE";
//     } catch (err) {
//         console.error("Integrity Check Error:", err);
//         return "ERROR";
//     }
// }

// /**
//  * 📄 Fetch and Render FIRs
//  */
// async function fetchFIRs() {
//     try {
//         const snapshot = await get(ref(db, 'FIRs'));
//         firListDiv.innerHTML = ""; // Clear loading message

//         if (snapshot.exists()) {
//             const allFIRs = snapshot.val();
//             const loggedInPhone = localStorage.getItem("userPhone");
//             let lastGlobalHash = null;

//             // Sort by timestamp to verify the chain in chronological order
//             const sortedKeys = Object.keys(allFIRs).sort((a, b) => allFIRs[a].timestamp - allFIRs[b].timestamp);

//             for (const firKey of sortedKeys) {
//                 const fir = allFIRs[firKey];
//                 const integrity = await verifyChainLink(fir, lastGlobalHash);
                
//                 // Only show the FIR if it belongs to the logged-in user
//                 if (fir.victim?.phone === loggedInPhone) {
//                     let status = { text: "✅ SECURE", color: "green", bg: "#e9f0ff" };
                    
//                     if (integrity === "TAMPERED") {
//                         status = { text: "⚠️ DATA TAMPERED", color: "red", bg: "#fff0f0" };
//                     } else if (integrity === "CHAIN_BROKEN") {
//                         status = { text: "🛑 CHAIN BROKEN", color: "orange", bg: "#fff9f0" };
//                     } else if (integrity === "OLD_RECORD") {
//                         status = { text: "❓ NO HASH", color: "gray", bg: "#f9f9f9" };
//                     }

//                     const firItem = document.createElement("div");
//                     firItem.className = "fir-box";
//                     firItem.style.borderLeft = `6px solid ${status.color}`;
//                     firItem.style.background = status.bg;
//                     firItem.style.padding = "15px";
//                     firItem.style.marginBottom = "10px";
//                     firItem.style.borderRadius = "8px";
//                     firItem.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";

//                     firItem.innerHTML = `
//                         <div style="float:right; color:${status.color}; font-weight:bold;">${status.text}</div>
//                         <h3>${fir.crime?.crimeType || "Report"}</h3>
//                         <p><strong>FIR ID:</strong> ${fir.firID}</p>
//                         <p><small>Blockchain Link: ${fir.previousHash ? fir.previousHash.substring(0,12) + "..." : "Genesis Block"}</small></p>
                        
//                         <button onclick="window.location.href='fir-details.html?id=${fir.firID}'" 
//                                 style="padding: 8px 15px; cursor: pointer; background: #1a73e8; color: white; border: none; border-radius: 4px;">
//                             View Details
//                         </button>
//                     `;
//                     firListDiv.appendChild(firItem);
//                 }
//                 // Store this block's hash as the 'previous' for the next iteration
//                 lastGlobalHash = fir.dataHash; 
//             }
//         } else {
//             firListDiv.innerHTML = "<li>No FIRs found in the database.</li>";
//         }
//     } catch (error) {
//         console.error("Fetch Error:", error);
//         firListDiv.innerHTML = "<li>Error loading data. Check console for details.</li>";
//     }
// }

// // Initial Call
// fetchFIRs();




import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// --- Firebase Configuration ---
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
        firListDiv.innerHTML = ""; 

        if (snapshot.exists()) {
            const allFIRs = snapshot.val();
            const loggedInPhone = localStorage.getItem("userPhone");
            let lastGlobalHash = null;

            // Chronological order mein sort karna zaroori hai
            const sortedKeys = Object.keys(allFIRs).sort((a, b) => allFIRs[a].timestamp - allFIRs[b].timestamp);

            for (const firKey of sortedKeys) {
                const fir = allFIRs[firKey];
                const integrity = await verifyChainLink(fir, lastGlobalHash);
                
                if (fir.victim?.phone === loggedInPhone) {
                    // ✅ Default Status (Secure)
                    let status = { text: "✅ SECURE", color: "#2ecc71", bgColor: "transparent" }; 
                    
                    if (integrity === "TAMPERED") {
                        // ✅ Dark Red aur Bada font warning ke liye
                        status = { text: "⚠️ DATA TAMPERED", color: "#c0392b", bgColor: "rgba(192, 57, 43, 0.2)" }; 
                    } else if (integrity === "CHAIN_BROKEN") {
                        status = { text: "🛑 CHAIN BROKEN", color: "#d35400", bgColor: "rgba(211, 84, 0, 0.1)" }; 
                    } else if (integrity === "OLD_RECORD") {
                        status = { text: "❓ NO HASH", color: "#95a5a6", bgColor: "transparent" }; 
                    }

                    const firItem = document.createElement("li"); 
                    firItem.className = "fir-box"; 
                    
                    // Box ka border color bhi status ke hisaab se badlega
                    firItem.style.borderLeft = `6px solid ${status.color}`;

                    firItem.innerHTML = `
                        <div style="grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                            <h3 style="margin:0; color: #a29bfe;">${fir.crime?.crimeType || "Report"}</h3>
                            <span style="color:${status.color}; font-size: 14px; font-weight: 900; border: 2px solid ${status.color}; padding: 4px 12px; border-radius: 6px; text-transform: uppercase; background: ${status.bgColor}; letter-spacing: 1px;">
                                ${status.text}
                            </span>
                        </div>
                        <div>FIR ID <span>#${fir.firID}</span></div>
                        <div>Victim Name <span>${fir.victim?.name || "N/A"}</span></div>
                        <div>Current Status <span>${fir.status || "Filed"}</span></div>
                        <div>Blockchain Hash <span style="font-family: monospace; font-size: 11px; color: #888; word-break: break-all;">${fir.dataHash ? fir.dataHash.substring(0,20) + "..." : "N/A"}</span></div>
                        
                        <div style="grid-column: 1 / -1; margin-top: 20px;">
                            <button onclick="window.location.href='fir-details.html?id=${fir.firID}'" 
                                    style="background: linear-gradient(135deg, #6c5ce7, #a29bfe); color: white; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; width: 100%; font-weight: 600; font-size: 15px; transition: 0.3s;">
                                <i class="fas fa-file-contract"></i> View Official Digital Record
                            </button>
                        </div>
                    `;
                    firListDiv.appendChild(firItem);
                }
                lastGlobalHash = fir.dataHash; 
            }
        } else {
            firListDiv.innerHTML = "<li class='no-data'>No FIRs found in the database.</li>";
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        firListDiv.innerHTML = "<li class='no-data'>Error loading data from Blockchain.</li>";
    }
}

// Initial Call
fetchFIRs();