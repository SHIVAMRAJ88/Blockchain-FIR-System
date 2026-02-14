const container = document.getElementById("three-container");

// Scene - Removed solid color to allow transparency
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
camera.position.z = 5;

// Renderer - Added 'alpha: true' for transparent background
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0); // Completely transparent
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x6c5ce7, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Blockchain blocks
const cubes = [];
const geometry = new THREE.BoxGeometry(1, 1, 1);

for (let i = 0; i < 5; i++) {
    const material = new THREE.MeshStandardMaterial({
        color: 0x6c5ce7,
        roughness: 0.2,
        metalness: 0.8
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = i * 1.5 - 3;
    scene.add(cube);
    cubes.push(cube);
}

// Animation
function animate() {
    requestAnimationFrame(animate);

    cubes.forEach((cube, index) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        // Floating movement
        cube.position.y = Math.sin(Date.now() * 0.002 + index) * 0.3;
    });

    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// Crime Map Button Logic
const viewCrimeMapBtn = document.getElementById("viewCrimeMapBtn");
if (viewCrimeMapBtn) {
    viewCrimeMapBtn.addEventListener("click", () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
            window.location.href = "crime-map.html"; // Map page par bhej do
        } else {
            alert("Please login to view the Crime Map!");
            window.location.href = "login.html";
        }
    });
}

// FIR Registration Button Logic
const registerBtn = document.getElementById("registerFirBtn");
if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
            window.location.href = "fir.html";
        } else {
            window.location.href = "login.html";
        }
    });
}

const trackfirBtn = document.getElementById("trackfirBtn");
if (trackfirBtn) {
    trackfirBtn.addEventListener("click", () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
            window.location.href = "dashboard.html";
        } else {
            window.location.href = "login.html";
        }
    });
}

// --- System & Tracking Connection ---
const trackStatusBtn = document.getElementById("trackStatusBtn");
const hashInput = document.getElementById("firHashInput");

if (trackStatusBtn) {
    trackStatusBtn.addEventListener("click", () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const hashValue = hashInput ? hashInput.value.trim() : "";

        if (isLoggedIn === "true") {
            if (hashValue !== "") {
                // User ko details page par le jao Hash ke saath
                window.location.href = `fir-details.html?hash=${hashValue}`;
            } else {
                alert("Enter FIR Hash ID !");
            }
        } else {
            alert("You should be login for tracking");
            window.location.href = "login.html";
        }
    });
}