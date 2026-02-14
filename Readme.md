Description:
In this project we have to create a webpage where users can file their FIR reports to the Police and can use the app to track their FIR status. To implement the blockchain immutability into the system we will use SHA256 hashing algorithm. It will be very helpful in securing the system as the blockchain algorithm can prevent in evidence manipulation and allow for transparency in investigation.

# FIRChain: Blockchain-Based FIR Management System

An immutable and transparent First Information Report (FIR) system leveraging **Blockchain technology** for data integrity and **Firebase** for secure user management.

##  Key Features
* **Immutable Records:** Once an FIR is registered, the data is hashed and stored, making it tamper-proof.
* **MetaMask Integration:** Secure authentication using Ethereum-based Web3 wallets.
* **Real-time Tracking:** Citizens can track the status of their FIR using a unique Case ID.
* **3D Interactive UI:** Modern dashboard featuring Three.js for a high-tech feel.
* **Zero-Knowledge Ready:** Designed to protect victim anonymity while ensuring accountability.

##  Tech Stack
* **Frontend:** HTML, CSS, JavaScript 
* **3D Graphics:** Three.js
* **Backend/Database:** Firebase Realtime Database
* **Web3:** MetaMask API & Ethers.js 

##  Project Structure
- `index.html` - The landing page (entry point).
- `login.html` - Secure login with traditional & MetaMask options.
- `fir1.html` - Form to file a new report.
- `scrip.js` - Main animation and navigation logic.
- `web3-auth.js` - Firebase & MetaMask authentication logic.

##  Installation & Setup
1. Clone the repository: `git clone https://github.com/SHIVAMRAJ88/Blockchain-FIR-System.git`
2. Open `index.html` using a local server (VS Code Live Server recommended).
3. Ensure your MetaMask extension is active.
