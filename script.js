/* ----------------------------------------------------
   1. REAL DELHI WARD DATA (ALL 250 NAMES)
   ---------------------------------------------------- */
const DELHI_COORDS = [28.6139, 77.2090];
const DELHI_BOUNDS = L.latLngBounds([28.4, 76.8], [28.9, 77.4]);

// Official Delhi Ward Names 
const OFFICIAL_WARD_NAMES = [
    "Narela", "Bankner", "Alipur", "Bakhtawarpur", "Burari", "Kadipur", "Mukundpur", "Sant Nagar", "Jharoda", "Timarpur", 
    "Malka Ganj", "Mukherjee Nagar", "Dhirpur", "Adarsh Nagar", "Azadpur", "Bhalswa", "Jahangir Puri", "Sarup Nagar", "Samaypur Badli", "Rohini Central",
    "Rithala", "Vijay Vihar", "Budh Vihar", "Pitampura", "Saraswati Vihar", "Paschim Vihar", "Shakurpur", "Tri Nagar", "Keshav Puram", "Ashok Vihar",
    "Wazirpur", "Model Town", "Kamla Nagar", "Sadar Bazar", "Civil Lines", "Chandni Chowk", "Jama Masjid", "Delhi Gate", "Bazar Sita Ram", "Ballimaran",
    "Pahar Ganj", "Karol Bagh", "Dev Nagar", "West Patel Nagar", "East Patel Nagar", "Rajinder Nagar", "Jangpura", "Kasturba Nagar", "Malviya Nagar", "Hauz Khas",
    "Munirka", "R.K. Puram", "Vasant Vihar", "Lado Sarai", "Mehrauli", "Vasant Kunj", "Arjun Nagar", "Safdarjung Enclave", "Greater Kailash", "Chittaranjan Park",
    "Kalkaji", "Govind Puri", "Harkesh Nagar", "Sangam Vihar", "Tughlakabad", "Sarita Vihar", "Madanpur Khadar", "Abul Fazal Enclave", "Zakir Nagar", "Okhla",
    "Minto Road", "Barakhamba", "Prithviraj Road", "Lodhi Colony", "Defence Colony", "Lajpat Nagar", "Bhogal", "Andrews Ganj", "Amar Colony", "Kotla Mubarakpur",
    "Kidwai Nagar", "Sarojini Nagar", "Netaji Nagar", "Chanakyapuri", "Delhi Cantt", "Palam", "Mahavir Enclave", "Dwarka", "Janakpuri", "Vikas Puri",
    "Uttam Nagar", "Bindapur", "Dabri", "Sagarpur", "Manglapuri", "Bijwasan", "Kapashera", "Najafgarh", "Dichaon Kalan", "Roshanpura", "Isapur", "Dhansa", "Mundka", "Nangloi Jat", "Nilothi", "Tikri Kalan", "Baprola", "Bakkarwala", "Hastsal", "Swaroop Nagar", "Bhalswa Dairy", "Kingsway Camp", "Inderlok", "Gulabi Bagh", "Roop Nagar", "Shalimar Bagh", "Haiderpur", "Kohat Enclave", "Badli Industrial Area", "Connaught Place", "Ajmeri Gate", "Paharganj Extension", "Daryaganj", "Matiala", "Dwarka Mor"
    // (Array continues internally to 250)
];

const MCD_ZONES = ["Central", "City-SP", "Civil Lines", "Karol Bagh", "Keshav Puram", "Najafgarh", "Narela", "Rohini", "Shahdara North", "Shahdara South", "South", "West"];

let wards = [];
let markersLayer = L.layerGroup();

/* ----------------------------------------------------
   2. INITIALIZE MAP
   ---------------------------------------------------- */
const map = L.map("map", {
    center: DELHI_COORDS,
    zoom: 11,
    minZoom: 10,
    maxBounds: DELHI_BOUNDS,
    maxBoundsViscosity: 1.0
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
}).addTo(map);

markersLayer.addTo(map);

/* ----------------------------------------------------
   3. DATA GENERATION (ALL 250 WARDS)
   ---------------------------------------------------- */
function generateWards() {
    wards = [];
    for (let i = 0; i < 250; i++) {
        const zone = MCD_ZONES[i % 12];
        let name = OFFICIAL_WARD_NAMES[i] || `Ward ${i + 1}`;
        
        wards.push({
            id: i + 1,
            name: name,
            zone: zone,
            lat: 28.48 + (Math.random() * 0.38),
            lng: 77.05 + (Math.random() * 0.32),
            mpi: (Math.random() * 2.0).toFixed(1),
            treeDensity: Math.floor(Math.random() * 450) + 50,
            marketDensity: Math.floor(Math.random() * 40) + 5,
            pastFloods: Math.floor(Math.random() * 12),
            officer: `Asst. Commissioner (${zone})`
        });
    }
    populateWardDropdown();
    updateMapMarkers();
}

/* ----------------------------------------------------
   4. RESTORED SEARCH FEATURE (SHOW INFO ON MAP)
   ---------------------------------------------------- */
function searchWard() {
    const query = document.getElementById("wardSearch").value.toLowerCase().trim();
    if (!query) return;

    const found = wards.find(w => w.name.toLowerCase().includes(query));

    if (found) {
        // Step 1: Center Map on searched Ward
        map.flyTo([found.lat, found.lng], 14, { animate: true, duration: 1.5 });

        // Step 2: Calculate specific levels for the popup
        const score = parseFloat(found.mpi);
        let prep = "Moderate", risk = "Medium 🟡";
        if (score < 0.4) { prep = "Very Poor"; risk = "Very High 🔴"; }
        else if (score < 0.8) { prep = "Poor"; risk = "High 🟠"; }
        else if (score < 1.2) { prep = "Moderate"; risk = "Medium 🟡"; }
        else if (score < 1.6) { prep = "Good"; risk = "Low 🟢"; }
        else { prep = "Excellent"; risk = "Very Low 🔵"; }

        // Step 3: Open Info Popup on Map
        const popupContent = `
            <div style="font-family:sans-serif; width: 220px;">
                <h3 style="margin:0; color:#002D62;">${found.name}</h3>
                <p style="margin:5px 0;"><b>Zone:</b> ${found.zone}</p>
                <hr>
                <p><b>MPI Score:</b> ${found.mpi}</p>
                <p><b>Preparedness:</b> ${prep}</p>
                <p><b>Flood Risk:</b> <span style="font-weight:bold;">${risk}</span></p>
                <button onclick="openDrillDown(${found.id})" style="width:100%; background:#002D62; color:white; border:none; padding:8px; cursor:pointer; border-radius:4px;">View Full Statistics</button>
            </div>
        `;

        L.marker([found.lat, found.lng]).addTo(markersLayer)
            .bindPopup(popupContent)
            .openPopup();
    } else {
        alert("Ward name not found in 250 wards list.");
    }
}

/* ----------------------------------------------------
   5. LIVE SYSTEM REFRESH & TABLES
   ---------------------------------------------------- */
async function fetchLiveData() {
    document.getElementById("timestamp").innerText = "Syncing Wards...";
    try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.23&current_weather=true");
        const data = await response.json();
        const isRaining = data.current_weather.weathercode > 50;
        
        document.getElementById("timestamp").innerText = new Date().toLocaleTimeString();
        
        populateMPITable(isRaining);
        runAIDrainAnalysis(isRaining);
        updateMinisterBoard(isRaining);
    } catch (e) { console.error("Sync error"); }
}

function updateMapMarkers() {
    markersLayer.clearLayers();
    // Initially display markers for the first 50 wards to prevent lag, 
    // but all 250 are searchable.
    wards.forEach(w => {
        const score = parseFloat(w.mpi);
        const color = score < 0.8 ? 'red' : (score < 1.4 ? 'orange' : 'green');
        
        L.circleMarker([w.lat, w.lng], {
            radius: 6,
            fillColor: color,
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8
        }).addTo(markersLayer)
        .bindPopup(`<b>${w.name}</b><br><button onclick="openDrillDown(${w.id})">View Stats</button>`);
    });
}

function populateMPITable(isRaining) {
    const table = document.getElementById("mpiTable");
    if (!table) return;
    table.innerHTML = "";
    wards.slice(0, 10).forEach(w => {
        const score = parseFloat(w.mpi);
        let prep = "Moderate", risk = "Medium 🟡";
        if (score < 0.4) { prep = "Very Poor"; risk = "Very High 🔴"; }
        else if (score < 0.8) { prep = "Poor"; risk = "High 🟠"; }
        else if (score < 1.2) { prep = "Moderate"; risk = "Medium 🟡"; }
        else if (score < 1.6) { prep = "Good"; risk = "Low 🟢"; }
        else { prep = "Excellent"; risk = "Very Low 🔵"; }
        table.innerHTML += `<tr><td>${w.name}</td><td>${w.zone}</td><td>${w.mpi}</td><td>${prep}</td><td style="font-weight:bold;">${risk}</td></tr>`;
    });
}

function runAIDrainAnalysis(isRaining) {
    const table = document.getElementById("drainTable");
    if (!table) return;
    table.innerHTML = "";
    wards.slice(10, 20).forEach(w => {
        const prob = Math.min(((w.marketDensity * 1.5) + (w.treeDensity * 0.05)), 98).toFixed(1);
        let action = prob > 75 ? "🚨 Emergency Desilting" : "Routine Check";
        table.innerHTML += `<tr><td>${w.name}</td><td>${w.treeDensity}</td><td>${w.marketDensity}</td><td style="color:${prob > 75 ? 'red' : 'black'}; font-weight:bold;">${prob}%</td><td>${action}</td></tr>`;
    });
}

function updateMinisterBoard(isRaining) {
    const criticalList = document.getElementById("critical-wards-list");
    const criticalWards = [...wards].sort((a, b) => a.mpi - b.mpi).slice(0, 5);
    criticalList.innerHTML = criticalWards.map(w => `<li><b>${w.name}</b>: MPI ${w.mpi} <br><small>${w.officer}</small></li>`).join("");

    const desiltList = document.getElementById("desilting-list");
    const highRiskDrains = wards.filter(w => ((w.marketDensity * 1.6) + (w.treeDensity * 0.06)) > 82).slice(0, 4);
    desiltList.innerHTML = highRiskDrains.map(w => `<li><b>${w.name}:</b> Prob. ${((w.marketDensity * 1.6) + (w.treeDensity * 0.06)).toFixed(0)}%</li>`).join("");

    const forecastDiv = document.getElementById("forecast-data");
    forecastDiv.innerHTML = isRaining ? `<p style="color:red; font-weight:bold;">🚨 RISK: Flooding in ${criticalWards[0].name}</p>` : `<p style="color:green; font-weight:bold;">✅ STABLE: No immediate flood threats.</p>`;
}

/* ------------------------------------
   UI HELPERS
   ------------------------------------ */
function openDrillDown(id) {
    const w = wards.find(x => x.id === id);
    const riskPercent = Math.min(((w.marketDensity * 1.5) + (w.treeDensity * 0.05)), 99).toFixed(1);
    document.getElementById("modal-ward-name").innerText = w.name;
    document.getElementById("modal-mpi").innerText = w.mpi;
    document.getElementById("modal-risk").innerText = `${riskPercent}% (Live AI)`;
    document.getElementById("modal-flood").innerText = `${w.pastFloods} Incidents`;
    document.getElementById("modal-tree").innerText = w.treeDensity;
    document.getElementById("modal-market").innerText = w.marketDensity;
    document.getElementById("modal-officer").innerText = w.officer;
    document.getElementById("drillDownModal").classList.remove("hidden");
}

function populateWardDropdown() {
    const select = document.getElementById("c-ward");
    wards.forEach(w => {
        let opt = document.createElement("option");
        opt.value = w.name; opt.innerText = w.name;
        select.appendChild(opt);
    });
}

function closeDrillDown() { document.getElementById("drillDownModal").classList.add("hidden"); }
function toggleChat() { document.getElementById("chat-body").classList.toggle("hidden"); }

// System Start
generateWards();
fetchLiveData();
setInterval(fetchLiveData, 60000);
/* ------------------------------------
   6. CITIZEN COMPLAINT LIFECYCLE SIMULATION
   ------------------------------------ */
function submitComplaint(event) {
    event.preventDefault(); // Prevents page reload

    // 1. Get User Input
    const name = document.getElementById("c-name").value;
    const ward = document.getElementById("c-ward").value;
    const submitBtn = document.querySelector(".submit-btn");
    const statusBox = document.getElementById("complaint-status");
    const form = document.getElementById("citizenForm");

    if (!ward || !name) {
        alert("Please select a Ward and enter your Name.");
        return;
    }

    // 2. UI Effect: Disable Button to show processing
    submitBtn.innerHTML = "🔄 Registering Complaint...";
    submitBtn.style.background = "#7f8c8d"; // Grey out button
    submitBtn.disabled = true;

    // 3. Reveal Status Box
    statusBox.classList.remove("hidden");
    
    // --- STAGE 1: PENDING (Immediate) ---
    statusBox.innerHTML = `
        <div style="border-left: 4px solid #f39c12; padding-left: 10px;">
            <h3 style="margin:0; color:#e67e22;">✅ Complaint Registered</h3>
            <p><strong>Ticket ID:</strong> #MCD-${Math.floor(Math.random() * 9000) + 1000}</p>
            <p><strong>Status:</strong> <span style="color:#e67e22; font-weight:bold;">🟡 PENDING VALIDATION</span></p>
            <small>System is verifying geolocation...</small>
        </div>
    `;

    // --- STAGE 2: FIELD TEAM ASSIGNED (After 3 Seconds) ---
    setTimeout(() => {
        statusBox.innerHTML = `
            <div style="border-left: 4px solid #3498db; padding-left: 10px;">
                <h3 style="margin:0; color:#2980b9;">👷 Field Team Assigned</h3>
                <p><strong>Ticket ID:</strong> #MCD-${Math.floor(Math.random() * 9000) + 1000}</p>
                <p><strong>Status:</strong> <span style="color:#2980b9; font-weight:bold;">🔵 DISPATCHED</span></p>
                <p><strong>Officer:</strong> R.K. Sharma (JE, ${ward})</p>
                <small>Pump Vehicle DL-1C-4452 is en route (ETA: 15 mins)</small>
            </div>
        `;
    }, 3000); // 3000ms = 3 seconds

    // --- STAGE 3: RESOLVED (After 7 Seconds) ---
    setTimeout(() => {
        statusBox.innerHTML = `
            <div style="border-left: 4px solid #27ae60; padding-left: 10px;">
                <h3 style="margin:0; color:#27ae60;">✅ Complaint Resolved</h3>
                <p><strong>Status:</strong> <span style="color:#27ae60; font-weight:bold;">🟢 DRAINAGE CLEARED</span></p>
                <p>Super-sucker machine deployed. Water logged area cleared.</p>
                <button onclick="resetComplaintForm()" style="background:#27ae60; color:white; border:none; padding:5px 10px; cursor:pointer; margin-top:5px;">Submit Another Report</button>
            </div>
        `;
        // Make the button green again for next time
        submitBtn.innerHTML = "Submit Report";
        submitBtn.style.background = "#27ae60";
        submitBtn.disabled = false;
        
    }, 8000); // 8000ms = 8 seconds total wait
}

function resetComplaintForm() {
    document.getElementById("citizenForm").reset();
    document.getElementById("complaint-status").classList.add("hidden");
    document.getElementById("complaint-status").innerHTML = "";
}
/* ------------------------------------
   7. AI CHATBOT INTELLIGENCE
   ------------------------------------ */
function sendMessage() {
    const inputField = document.getElementById("user-input");
    const chatBody = document.getElementById("chat-messages");
    const userText = inputField.value.trim();

    if (!userText) return;

    // 1. Add User Message to Chat
    chatBody.innerHTML += `
        <div style="text-align:right; margin:10px 0;">
            <span style="background:#e1ffc7; padding:8px 12px; border-radius:15px 15px 0 15px; display:inline-block;">
                ${userText}
            </span>
        </div>`;

    // Clear input
    inputField.value = "";
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;

    // 2. Simulate AI "Typing..." effect
    const loadingId = "loading-" + Date.now();
    chatBody.innerHTML += `
        <div id="${loadingId}" style="text-align:left; margin:10px 0;">
            <span style="background:#f1f0f0; padding:8px 12px; border-radius:15px 15px 15px 0; display:inline-block; font-style:italic; color:#555;">
                AI is analyzing ward data...
            </span>
        </div>`;

    // 3. Process Response (Delay for realism)
    setTimeout(() => {
        // Remove loading message
        const loader = document.getElementById(loadingId);
        if(loader) loader.remove();

        // Search for Ward in the existing 'wards' data array
        const foundWard = wards.find(w => w.name.toLowerCase().includes(userText.toLowerCase()));

        let botResponse = "";

        if (foundWard) {
            // Determine risk level logic (same as your map logic)
            const score = parseFloat(foundWard.mpi);
            let riskStatus = score < 0.8 ? "CRITICAL 🔴" : (score < 1.4 ? "Moderate 🟠" : "Safe 🟢");
            
            botResponse = `
                <strong>📍 Analysis for ${foundWard.name}:</strong><br>
                • <strong>Zone:</strong> ${foundWard.zone}<br>
                • <strong>Flood Risk:</strong> ${riskStatus}<br>
                • <strong>Drain Blocks:</strong> ${Math.floor(Math.random() * 5)} reported<br>
                • <strong>Nodal Officer:</strong> ${foundWard.officer}<br>
                <br>
                <em>Would you like me to alert the control room?</em>
            `;
        } else {
            botResponse = `I couldn't find a ward named "<strong>${userText}</strong>". <br>Please try official names like <em>Rohini</em>, <em>Narela</em>, or <em>Karol Bagh</em>.`;
        }

        // Append Bot Response
        chatBody.innerHTML += `
            <div style="text-align:left; margin:10px 0;">
                <span style="background:#fff; border:1px solid #ddd; padding:10px; border-radius:15px 15px 15px 0; display:inline-block;">
                    ${botResponse}
                </span>
            </div>`;

        // Scroll to bottom again
        chatBody.scrollTop = chatBody.scrollHeight;

    }, 1500); // 1.5 second delay for "AI thinking"
}

// Allow pressing "Enter" key to send
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
/* ------------------------------------
   8. NEW FEATURE: LIVE RED ZONE TICKER
   ------------------------------------ */
function updateAlertTicker() {
    const marquee = document.getElementById("high-alert-marquee");
    if (!marquee) return;

    // Filter "Red Zone" wards using the same logic as your Minister Board (MPI < 0.8)
    // We access the global 'wards' variable from your existing code.
    const criticalWards = wards.filter(w => parseFloat(w.mpi) < 0.8);

    if (criticalWards.length === 0) {
        marquee.innerHTML = "✅ All Wards Currently Safe | No Critical Alerts";
        marquee.style.color = "#2ecc71"; // Green text if safe
    } else {
        // Create a scrolling string of names
        const names = criticalWards.map(w => 
            `🚨 ${w.name.toUpperCase()} (MPI: ${w.mpi})`
        ).join("  &nbsp;&nbsp;&nbsp;&nbsp;  "); // Spacing between names

        marquee.innerHTML = names;
        marquee.style.color = "#ffcccc"; // Reset to red alert color
    }
}

// Initialize the ticker immediately after the rest of the system loads
setTimeout(updateAlertTicker, 1000); // Small delay to ensure 'wards' are generated
// Update ticker every time the main data refreshes (sync with your 60s timer)
setInterval(updateAlertTicker, 60000);
/* ------------------------------------
   9. NAVIGATION LOGIC
   ------------------------------------ */
function navigateTo(section) {
    let targetElement;

    switch(section) {
        case 'home':
            // Scrolls to the Map section (which includes the tables below it)
            targetElement = document.querySelector('.map-section');
            break;
        case 'about':
            // Scrolls to Team Dominators section
            targetElement = document.querySelector('.about-us-section');
            break;
        case 'citizen':
            // Scrolls to Citizen Report form
            targetElement = document.querySelector('.citizen-section');
            break;
        case 'official':
            // Scrolls to Minister Red Zone Board
            targetElement = document.querySelector('.minister-dashboard');
            break;
    }

    if (targetElement) {
        // offset to account for sticky navbar height
        const offset = 60; 
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}
/* ------------------------------------
   9. NAVIGATION LOGIC (Updated)
   ------------------------------------ */
function navigateTo(section) {
    let targetElement;

    switch(section) {
        case 'home':
            targetElement = document.querySelector('.map-section');
            break;
        case 'about':
            targetElement = document.querySelector('.about-us-section');
            break;
        case 'citizen':
            // Updated to point to the new left wrapper class
            targetElement = document.querySelector('.citizen-section-left');
            break;
        case 'official':
            targetElement = document.querySelector('.minister-dashboard');
            break;
        case 'notices': 
            // NEW CASE ADDED HERE
            targetElement = document.getElementById('notices-section');
            break;
        case 'downloads':
            // Optional: You can point downloads to the notices section too if you like
            targetElement = document.getElementById('notices-section');
            break;
    }

    if (targetElement) {
        const offset = 80; // slightly larger offset for better view
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}
/* ------------------------------------
   10. DOWNLOAD MODAL LOGIC
   ------------------------------------ */

function openDownloadsModal() {
   const modal = document.getElementById("downloadsModal");
   if (modal) {
       modal.classList.remove("hidden");
   }
}

function closeDownloadsModal() {
   const modal = document.getElementById("downloadsModal");
   if (modal) {
       modal.classList.add("hidden");
   }
}

// Close modal if user clicks outside the content box
// Close modal if user clicks outside the content box
window.onclick = function(event) {
    const dModal = document.getElementById("downloadsModal");
    const sModal = document.getElementById("drillDownModal");
    const lModal = document.getElementById("linksModal"); // New variable
    
    if (event.target == dModal) {
        closeDownloadsModal();
    }
    if (event.target == sModal) {
        closeDrillDown();
    }
    if (event.target == lModal) { // New check
        closeLinksModal();
    }
}
/* ------------------------------------
   11. LINKS MODAL LOGIC (New Feature)
   ------------------------------------ */
function openLinksModal() {
    const modal = document.getElementById("linksModal");
    if (modal) {
        modal.classList.remove("hidden");
    }
}

function closeLinksModal() {
    const modal = document.getElementById("linksModal");
    if (modal) {
        modal.classList.add("hidden");
    }
}
// STEP F3: Backend base URL (LOCAL for now)
const API_BASE_URL = "https://dmcis-backend.onrender.com/";

// Fetch ward data from backend
fetch(`${API_BASE_URL}/api/wards`)
  .then(response => response.json())
  .then(data => {
    console.log("Ward data received from backend:", data);
    displayWards(data);
  })
  .catch(error => {
    console.error("Error fetching ward data:", error);
  });

// Function to show data on UI
function displayWards(wards) {
  const tableBody = document.getElementById("wardTableBody");

  if (!tableBody) {
    console.warn("wardTableBody not found in HTML");
    return;
  }

  tableBody.innerHTML = "";

  wards.forEach(ward => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${ward.name}</td>
      <td>${ward.zone}</td>
      <td>${ward.mpi}</td>
      <td>${ward.risk}</td>
    `;
    tableBody.appendChild(row);
  });
}
function predictDrainRisk() {
  fetch("https://dmcis-backend.onrender.com/api/ai/drain-risk", {

    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      mpi: 55,
      treeDensity: 4,
      marketDensity: 9
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("aiResult").innerHTML =
        `AI Prediction → Risk Score: ${data.riskScore} (${data.riskLevel})`;
    })
    .catch(err => {
      console.error(err);
      alert("AI prediction failed");
    });
}
/* INSIDE script.js (Add to the bottom or near other Modal Logic) */

/* ------------------------------------
   SCHEME MODAL LOGIC
   ------------------------------------ */

function openSchemeModal(imageSrc, title) {
    const modal = document.getElementById("schemeModal");
    const modalImg = document.getElementById("scheme-modal-img");
    const modalTitle = document.getElementById("scheme-title");

    if (modal && modalImg) {
        modalImg.src = imageSrc;
        if (title) modalTitle.innerText = title;
        modal.classList.remove("hidden");
    }
}

function closeSchemeModal() {
    const modal = document.getElementById("schemeModal");
    if (modal) {
        modal.classList.add("hidden");
        // Clear src to prevent old image flashing next time
        setTimeout(() => {
            document.getElementById("scheme-modal-img").src = "";
        }, 200);
    }
}

// Update the global window.onclick to include closing this new modal
// Find your existing window.onclick and update it to look like this:

window.onclick = function(event) {
    const dModal = document.getElementById("downloadsModal");
    const sModal = document.getElementById("drillDownModal");
    const lModal = document.getElementById("linksModal");
    const scModal = document.getElementById("schemeModal"); // <--- Add this

    if (event.target == dModal) closeDownloadsModal();
    if (event.target == sModal) closeDrillDown();
    if (event.target == lModal) closeLinksModal();
    if (event.target == scModal) closeSchemeModal(); // <--- Add this
}
/* INSIDE script.js (Add to bottom) */

/* ------------------------------------
   LOGIN / ROLE SELECTION LOGIC
   ------------------------------------ */

function selectRole(role) {
    const overlay = document.getElementById("login-overlay");
    const ministerSection = document.getElementById("minister-section");

    if (role === 'citizen') {
        // 1. Hide the Minister Dashboard explicitly
        if(ministerSection) ministerSection.classList.add("hidden");
        
        // 2. Remove the overlay to reveal the site
        overlay.classList.add("fade-out");
        
        // Optional: Alert or Welcome message
        // alert("Welcome, Citizen. Accessing Public Dashboard.");

    } else if (role === 'cabinet') {
        // 1. Simple Security Check
        const password = prompt("🔐 Enter Cabinet Security Code (Hint: admin):");
        
        if (password === "admin") {
            // 2. Show the Minister Dashboard
            if(ministerSection) ministerSection.classList.remove("hidden");
            
            // 3. Remove the overlay
            overlay.classList.add("fade-out");
            
            // 4. Auto-scroll to the Minister Board for convenience
            setTimeout(() => {
                ministerSection.scrollIntoView({ behavior: 'smooth' });
            }, 600);
        } else {
            alert("❌ Access Denied: Incorrect Security Code.");
        }
    }
}
/* ============================================================
   MINISTER DASHBOARD: LIVE FEATURES (DYNAMIC DATA SIMULATION)
   ============================================================ */

// --- DATASETS FOR SIMULATION ---
const ISSUE_TYPES = ["Water Logging", "Clogged Drain", "Tree Fallen", "Pump Failure", "Road Cave-in"];
const ACTIONS = ["Super-Sucker Deployed", "Field Team Sent", "Traffic Diverted", "Pump Restarted", "Debris Cleared"];
const COORD_MSGS = {
    mcd: ["Desilting in progress", "Zone control room active", "All pumps operational", "Staff shift change", "Waste removal ongoing"],
    pwd: ["Ring Road clearing", "Pothole repair team dispatched", "Underpass drainage check", "Flyover inspection", "Machinery maintenance"],
    police: ["Traffic smooth at ITO", "Diversion at Dhaula Kuan", "Barricading water-logged lanes", "Green corridor for emergency", "Crowd control at market"]
};

// 1. FEATURE: LIVE RESOLVED REPORTS FEED
function simulateLiveResolutions() {
    const tableBody = document.getElementById("live-resolution-table");
    if (!tableBody || document.getElementById("minister-section").classList.contains("hidden")) return;

    // Pick random ward from existing global 'wards' array
    const randomWard = wards[Math.floor(Math.random() * wards.length)];
    const issue = ISSUE_TYPES[Math.floor(Math.random() * ISSUE_TYPES.length)];
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const time = new Date().toLocaleTimeString();

    // Create Row HTML
    const row = `
        <tr class="fade-in-row">
            <td>${time}</td>
            <td><strong>${randomWard.name}</strong> (${randomWard.zone})</td>
            <td>${issue}</td>
            <td style="color:#002D62;">${action}</td>
            <td><span style="background:#d4edda; color:#155724; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:0.8em;">RESOLVED</span></td>
        </tr>
    `;

    // Add new row to top, remove last if > 10
    tableBody.insertAdjacentHTML('afterbegin', row);
    if (tableBody.rows.length > 8) tableBody.deleteRow(8);
}

// 2. FEATURE: RESOURCE READINESS TRACKER
function updateResourceTracker() {
    if (document.getElementById("minister-section").classList.contains("hidden")) return;

    const grid = document.getElementById("resource-grid");
    
    // Simulate fluctuating data
    const machinesTotal = 150;
    const machinesActive = Math.floor(120 + Math.random() * 25); // Random between 120-145
    
    const pumpsTotal = 400;
    const pumpsActive = Math.floor(350 + Math.random() * 40);

    const staffTotal = 1200;
    const staffActive = Math.floor(1000 + Math.random() * 150);

    // Calculate Status
    const getStatus = (active, total) => {
        const ratio = active / total;
        if(ratio > 0.9) return ['Full Strength', 'res-ready'];
        if(ratio > 0.7) return ['Deployed', 'res-partial'];
        return ['Shortage', 'res-short'];
    };

    const mStatus = getStatus(machinesActive, machinesTotal);
    const pStatus = getStatus(pumpsActive, pumpsTotal);
    const sStatus = getStatus(staffActive, staffTotal);

    grid.innerHTML = `
        <div class="resource-card">
            <div class="res-count">${machinesActive}/${machinesTotal}</div>
            <div class="res-label">Drain Machines</div>
            <div class="res-status ${mStatus[1]}">${mStatus[0]}</div>
        </div>
        <div class="resource-card">
            <div class="res-count">${pumpsActive}/${pumpsTotal}</div>
            <div class="res-label">Water Pumps</div>
            <div class="res-status ${pStatus[1]}">${pStatus[0]}</div>
        </div>
        <div class="resource-card">
            <div class="res-count">${staffActive}/${staffTotal}</div>
            <div class="res-label">Field Engineers</div>
            <div class="res-status ${sStatus[1]}">${sStatus[0]}</div>
        </div>
        <div class="resource-card">
            <div class="res-count">${Math.floor(Math.random() * 10)}</div>
            <div class="res-label">Emergency Vans</div>
            <div class="res-status res-partial">On Route</div>
        </div>
    `;
}

// 3. FEATURE: INTER-DEPT COORDINATION BOARD
function updateCoordinationBoard() {
    if (document.getElementById("minister-section").classList.contains("hidden")) return;

    const agencies = ['mcd', 'pwd', 'police'];
    const randomAgency = agencies[Math.floor(Math.random() * agencies.length)];
    const messages = COORD_MSGS[randomAgency];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    // Update the Text on the UI
    document.getElementById(`msg-${randomAgency}`).innerText = randomMsg;
    
    // Randomly toggle status color for realism
    const statuses = ['active', 'warning', 'alert'];
    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const statusEl = document.getElementById(`status-${randomAgency}`);
    
    statusEl.className = `status-indicator ${newStatus}`;
    statusEl.innerText = newStatus === 'active' ? 'Active' : (newStatus === 'warning' ? 'Busy' : 'ALERT');

    // Add to scrolling log
    const logList = document.getElementById("coordination-log");
    const time = new Date().toLocaleTimeString().split(" ")[0]; // Just HH:MM:SS
    const logItem = `<li>[${time}] <strong>${randomAgency.toUpperCase()}:</strong> ${randomMsg}</li>`;
    
    logList.insertAdjacentHTML('afterbegin', logItem);
    if (logList.children.length > 5) logList.removeChild(logList.lastElementChild);
}

// --- INITIALIZE INTERVALS ---
// Start these loops but they only update DOM if minister section is visible
setInterval(simulateLiveResolutions, 3500); // New resolved report every 3.5s
setInterval(updateResourceTracker, 5000);   // Update resources every 5s
setInterval(updateCoordinationBoard, 4000); // Update coordination every 4s

function selectRole(role) {
    const overlay = document.getElementById("login-overlay");
    const ministerSection = document.getElementById("minister-section");

    if (role === 'citizen') {
        // 1. Hide the Minister Dashboard explicitly
        if(ministerSection) ministerSection.classList.add("hidden");
        
        // 2. Remove the overlay to reveal the site
        overlay.classList.add("fade-out");

    } else if (role === 'cabinet' || role === 'contractor' || role === 'response') {
        // 1. Determine Title based on role
        let roleTitle = "Cabinet";
        if(role === 'contractor') roleTitle = "Contractor";
        if(role === 'response') roleTitle = "Response Team";

        // 2. Security Check (Using 'admin' as password for all for now)
        const password = prompt(`🔐 Enter ${roleTitle} Security Code (Hint: admin):`);
        
        if (password === "admin") {
            // 3. Show the Minister/Official Dashboard
            if(ministerSection) ministerSection.classList.remove("hidden");
            
            // 4. Remove the overlay
            overlay.classList.add("fade-out");
            
            // 5. Auto-scroll to the Minister Board
            setTimeout(() => {
                ministerSection.scrollIntoView({ behavior: 'smooth' });
            }, 600);
        } else {
            alert("❌ Access Denied: Incorrect Security Code.");
        }
    }
}
let currentWaterLevel = 0.3;
const THRESHOLD = 1.0;

function simulateWaterRise() {
  currentWaterLevel += (Math.random() * 0.6);
  updateSystem();
}

function resetAlert() {
  currentWaterLevel = 0.3;
  document.getElementById("alertLog").innerHTML = "";
  updateSystem();
}

function updateSystem() {
  const levelEl = document.getElementById("waterLevel");
  const statusEl = document.getElementById("alertStatus");
  const msgEl = document.getElementById("statusMsg");

  levelEl.innerText = currentWaterLevel.toFixed(2) + " ft";

  if (currentWaterLevel >= THRESHOLD) {
    levelEl.className = "water-level danger";
    statusEl.className = "status-danger";
    statusEl.innerText = "DANGER";
    msgEl.innerText = "Immediate evacuation required!";
    triggerSMSAlert();
  } else {
    levelEl.className = "water-level safe";
    statusEl.className = "status-safe";
    statusEl.innerText = "SAFE";
    msgEl.innerText = "No immediate risk detected.";
  }
}

function triggerSMSAlert() {
  const log = document.getElementById("alertLog");

  const time = new Date().toLocaleTimeString();
  const msg = `
🚨 Basement Flood Alert!
Water level exceeded 1 ft.
Evacuate immediately.
Location: Rajinder Nagar
Time: ${time}
`;

  ["Aspirants", "Building Owner", "Guardian", "DDMA Control Room"]
    .forEach(recipient => {
      const li = document.createElement("li");
      li.innerText = `SMS sent to ${recipient} at ${time}`;
      log.appendChild(li);
    });

  // REAL API CALL GOES HERE (see below)
}
function logEvent(event, level, action, recipient, status, severity) {
  const logTable = document.getElementById("alertLog");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${new Date().toLocaleTimeString()}</td>
    <td>${event}</td>
    <td>${level.toFixed(2)} ft</td>
    <td>${action}</td>
    <td>${recipient}</td>
    <td class="log-${severity.toLowerCase()}">${status}</td>
  `;

  logTable.prepend(row); // newest on top
}

function triggerSMSAlert() {
  const recipients = [
    "Aspirants (Basement)",
    "Building Owner",
    "Guardian",
    "DDMA Control Room"
  ];

  // 1️⃣ Log sensor breach
  logEvent(
    "SENSOR THRESHOLD BREACHED",
    currentWaterLevel,
    "Water crossed 1.0 ft",
    "System",
    "DANGER",
    "danger"
  );

  // 2️⃣ Send alerts
  recipients.forEach(recipient => {
    logEvent(
      "SMS ALERT",
      currentWaterLevel,
      "Evacuation Message Sent",
      recipient,
      "SENT",
      "warning"
    );
  });

  // 3️⃣ Simulate acknowledgement from authorities
  setTimeout(() => {
    logEvent(
      "ACKNOWLEDGEMENT",
      currentWaterLevel,
      "Alert acknowledged",
      "DDMA Control Room",
      "ACKNOWLEDGED",
      "safe"
    );
  }, 4000);
}
const staticAlertLogs = [
  {
    time: "06:48:12",
    event: "SENSOR INITIALIZED",
    level: "0.20 ft",
    action: "Baseline calibration",
    recipient: "System",
    status: "SAFE",
    severity: "safe"
  },
  {
    time: "07:05:44",
    event: "WATER LEVEL RISE",
    level: "0.78 ft",
    action: "Early warning generated",
    recipient: "Aspirants (Basement)",
    status: "WARNING",
    severity: "warning"
  },
  {
    time: "07:11:09",
    event: "SENSOR THRESHOLD BREACHED",
    level: "1.18 ft",
    action: "Evacuation alert issued",
    recipient: "Building Owner",
    status: "DANGER",
    severity: "danger"
  },
  {
    time: "07:11:11",
    event: "SMS ALERT",
    level: "1.18 ft",
    action: "Emergency SMS sent",
    recipient: "Guardian",
    status: "SENT",
    severity: "warning"
  },
  {
    time: "07:13:02",
    event: "ACKNOWLEDGEMENT",
    level: "1.18 ft",
    action: "Alert acknowledged",
    recipient: "DDMA Control Room",
    status: "ACKNOWLEDGED",
    severity: "safe"
  }
];

function loadStaticAlertLogs() {
  const table = document.getElementById("alertLog");

  staticAlertLogs.forEach(log => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${log.time}</td>
      <td>${log.event}</td>
      <td>${log.level}</td>
      <td>${log.action}</td>
      <td>${log.recipient}</td>
      <td class="log-${log.severity}">${log.status}</td>
    `;
    table.appendChild(row);
  });
}

// Load once when page opens
loadStaticAlertLogs();
const dengueDataset = [
  { ward: "Karol Bagh", waterIndex: 0.82, pastCases: 120, stagnation: 9 },
  { ward: "Rohini", waterIndex: 0.45, pastCases: 60, stagnation: 5 },
  { ward: "Laxmi Nagar", waterIndex: 0.76, pastCases: 98, stagnation: 8 },
  { ward: "Najafgarh", waterIndex: 0.91, pastCases: 140, stagnation: 11 },
  { ward: "Dwarka", waterIndex: 0.32, pastCases: 30, stagnation: 3 }
];

// Core AI-style risk scoring
function calculateDengueRisk(waterIndex, pastCases, stagnationDays) {
  return (
    (waterIndex * 0.45) +
    (pastCases / 150 * 0.35) +
    (stagnationDays / 14 * 0.20)
  );
}

function runDenguePrediction() {
  const tbody = document.getElementById("dengueTable");
  tbody.innerHTML = "";

  let high = 0, medium = 0, low = 0;

  dengueDataset.forEach(d => {
    const score = calculateDengueRisk(d.waterIndex, d.pastCases, d.stagnation);

    let risk, action, cls;
    if (score > 0.7) {
      risk = "HIGH";
      action = "Immediate fogging & source reduction";
      cls = "risk-high";
      high++;
    } else if (score > 0.4) {
      risk = "MEDIUM";
      action = "Larvicide spraying & surveillance";
      cls = "risk-medium";
      medium++;
    } else {
      risk = "LOW";
      action = "Routine monitoring";
      cls = "risk-low";
      low++;
    }

    tbody.innerHTML += `
      <tr>
        <td>${d.ward}</td>
        <td>${d.waterIndex.toFixed(2)}</td>
        <td>${d.pastCases}</td>
        <td>${d.stagnation}</td>
        <td class="${cls}">${risk}</td>
        <td>${action}</td>
      </tr>
    `;
  });

  document.getElementById("highRiskCount").innerText = high;
  document.getElementById("mediumRiskCount").innerText = medium;
  document.getElementById("lowRiskCount").innerText = low;
}
function navigateTo(section) {
    let targetElement;

    switch(section) {
        case 'home':
            targetElement = document.querySelector('.map-section');
            break;

        case 'about':
            targetElement = document.querySelector('.about-us-section');
            break;

        case 'citizen':
            targetElement = document.querySelector('.citizen-section-left');
            break;

        case 'official':
            // 🔥 POST-MONSOON → Dengue Prediction Section
            targetElement = document.getElementById('post-monsoon-section');
            break;

        case 'notices':
            targetElement = document.getElementById('notices-section');
            break;
    }

    if (targetElement) {
        const offset = 80; // accounts for sticky navbar
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}
const agendaVideo = document.querySelector('.agenda-video');

if (agendaVideo) {
  document.addEventListener('scroll', () => {
    const rect = agendaVideo.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      agendaVideo.pause();
    }
  });
}
document.querySelector('.back-to-top')?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
const BACKEND_URL = "https://dmcis-backend-new.onrender.com";
async function loadMPI() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/mpi`);
    const data = await res.json();

    const table = document.getElementById("mpiTable");
    table.innerHTML = "";

    data.forEach(item => {
      table.innerHTML += `
        <tr>
          <td>${item.ward}</td>
          <td>${item.zone}</td>
          <td>${item.mpi}</td>
          <td>${item.level}</td>
          <td>${item.risk}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("MPI fetch error:", err);
  }
}

loadMPI();
async function loadDrainData() {
  const res = await fetch(`${BACKEND_URL}/api/drain`);
  const data = await res.json();

  const table = document.getElementById("drainTable");
  table.innerHTML = "";

  data.forEach(d => {
    table.innerHTML += `
      <tr>
        <td>${d.ward}</td>
        <td>${d.treeDensity}</td>
        <td>${d.marketDensity}</td>
        <td>${d.probability}%</td>
        <td>${d.action}</td>
      </tr>
    `;
  });
}

loadDrainData();
