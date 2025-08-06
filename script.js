// Initialize map in EPSG:3857 (default for Leaflet and Mapbox)
const map = L.map('map').setView([30.3753, 69.3451], 6);

// Add Mapbox base layer (or fallback to OSM if preferred)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

// GeoServer WMS base URL
const wmsUrl = "http://localhost:8080/geoserver/pakistan_map/wms";

// Define WMS layers with EPSG:3857 (so they match base map)
const roadsLayer = L.tileLayer.wms(wmsUrl, {
  layers: "pakistan_map:gis_osm_roads_free_1",
  format: "image/png",
  transparent: true,
  version: "1.1.0",
  crs: L.CRS.EPSG3857
});

const RailwaysLayer = L.tileLayer.wms(wmsUrl, {
  layers: "pakistan_map:gis_osm_railways_free_1",
  format: "image/png",
  transparent: true,
  version: "1.1.0",
  crs: L.CRS.EPSG3857
});

const landuseLayer = L.tileLayer.wms(wmsUrl, {
  layers: "pakistan_map:gis_osm_landuse_a_free_1",
  format: "image/png",
  transparent: true,
  version: "1.1.0",
  crs: L.CRS.EPSG3857
});

const buildingsLayer = L.tileLayer.wms(wmsUrl, {
  layers: "pakistan_map:gis_osm_buildings_a_free_1",
  format: "image/png",
  transparent: true,
  version: "1.1.0",
  crs: L.CRS.EPSG3857
});

const transportLayer = L.tileLayer.wms(wmsUrl, {
  layers: "pakistan_map:gis_osm_transport_a_free_1",
  format: "image/png",
  transparent: true,
  version: "1.1.0",
  crs: L.CRS.EPSG3857
});

// Add layers to map
roadsLayer.addTo(map);
RailwaysLayer.addTo(map);
landuseLayer.addTo(map);
buildingsLayer.addTo(map);
transportLayer.addTo(map);

// Store initial map state for reset functionality
const initialMapState = {
  center: [30.3753, 69.3451],
  zoom: 6
};

// Theme management
let currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

// Update theme icon
function updateThemeIcon() {
  const themeIcon = document.getElementById('themeIcon');
  if (currentTheme === 'light') {
    themeIcon.className = 'fas fa-sun';
  } else {
    themeIcon.className = 'fas fa-moon';
  }
}

// Toggle theme function
function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  updateThemeIcon();
}

// Reset map to initial state
function resetMap() {
  map.setView(initialMapState.center, initialMapState.zoom);
}

// Update mouse coordinates
map.on('mousemove', function (e) {
  document.getElementById('coordinates').innerText =
    `Lat: ${e.latlng.lat.toFixed(5)}, Lon: ${e.latlng.lng.toFixed(5)}`;
});

// Update zoom level
map.on('zoomend', function() {
  document.getElementById('zoomLevel').innerText = map.getZoom();
});

// Update date/time
function updateDateTime() {
  const now = new Date();
  document.getElementById('datetime').innerText = now.toLocaleString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Panel toggle functionality
function togglePanel() {
  const panel = document.getElementById('layer-panel');
  const toggleBtn = document.getElementById('panelToggle');
  const icon = toggleBtn.querySelector('i');
  
  if (panel.classList.contains('collapsed')) {
    panel.classList.remove('collapsed');
    icon.className = 'fas fa-chevron-left';
  } else {
    panel.classList.add('collapsed');
    icon.className = 'fas fa-chevron-right';
  }
}

// Legend toggle functionality
function toggleLegend() {
  const legend = document.getElementById('legendBox');
  const toggleBtn = document.getElementById('legendToggle');
  const icon = toggleBtn.querySelector('i');
  
  if (legend.classList.contains('collapsed')) {
    legend.classList.remove('collapsed');
    icon.className = 'fas fa-chevron-up';
  } else {
    legend.classList.add('collapsed');
    icon.className = 'fas fa-chevron-down';
  }
}

// Enhanced Google Maps-style Search functionality
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const clearSearch = document.getElementById('clearSearch');

// Comprehensive POI database for Pakistan with Google Maps-style search
const poiDatabase = [
  // Major Cities and Districts
  { name: "Islamabad", type: "City", lat: 33.6844, lng: 73.0479, category: "City", searchTerms: ["islamabad", "capital", "federal"] },
  { name: "Karachi", type: "City", lat: 24.8607, lng: 67.0011, category: "City", searchTerms: ["karachi", "sindh", "port"] },
  { name: "Lahore", type: "City", lat: 31.5204, lng: 74.3587, category: "City", searchTerms: ["lahore", "punjab", "cultural"] },
  { name: "Peshawar", type: "City", lat: 34.0150, lng: 71.5249, category: "City", searchTerms: ["peshawar", "kpk", "frontier"] },
  { name: "Quetta", type: "City", lat: 30.1798, lng: 66.9749, category: "City", searchTerms: ["quetta", "balochistan", "provincial"] },
  { name: "Multan", type: "City", lat: 30.1575, lng: 71.5249, category: "City", searchTerms: ["multan", "punjab", "sufi"] },
  { name: "Faisalabad", type: "City", lat: 31.4167, lng: 73.0833, category: "City", searchTerms: ["faisalabad", "punjab", "textile"] },
  { name: "Rawalpindi", type: "City", lat: 33.6844, lng: 73.0479, category: "City", searchTerms: ["rawalpindi", "punjab", "twin"] },
  
  // Airports and Transportation
  { name: "Islamabad International Airport", type: "Airport", lat: 33.6167, lng: 73.0992, category: "Transport", searchTerms: ["airport", "islamabad", "flight", "terminal"] },
  { name: "Jinnah International Airport Karachi", type: "Airport", lat: 24.9065, lng: 67.1602, category: "Transport", searchTerms: ["airport", "karachi", "jinnah", "flight"] },
  { name: "Allama Iqbal International Airport Lahore", type: "Airport", lat: 31.5216, lng: 74.4036, category: "Transport", searchTerms: ["airport", "lahore", "iqbal", "flight"] },
  { name: "Bacha Khan International Airport Peshawar", type: "Airport", lat: 33.9939, lng: 71.5143, category: "Transport", searchTerms: ["airport", "peshawar", "bacha", "flight"] },
  
  // Hospitals and Healthcare
  { name: "Shifa International Hospital Islamabad", type: "Hospital", lat: 33.6844, lng: 73.0479, category: "Healthcare", searchTerms: ["hospital", "shifa", "medical", "health"] },
  { name: "Aga Khan University Hospital Karachi", type: "Hospital", lat: 24.8607, lng: 67.0011, category: "Healthcare", searchTerms: ["hospital", "aga khan", "medical", "health"] },
  { name: "Mayo Hospital Lahore", type: "Hospital", lat: 31.5204, lng: 74.3587, category: "Healthcare", searchTerms: ["hospital", "mayo", "medical", "health"] },
  { name: "Lady Reading Hospital Peshawar", type: "Hospital", lat: 34.0150, lng: 71.5249, category: "Healthcare", searchTerms: ["hospital", "lady reading", "medical", "health"] },
  
  // Universities and Education
  { name: "Quaid-i-Azam University Islamabad", type: "University", lat: 33.6844, lng: 73.0479, category: "Education", searchTerms: ["university", "quaid", "education", "college"] },
  { name: "University of Karachi", type: "University", lat: 24.8607, lng: 67.0011, category: "Education", searchTerms: ["university", "karachi", "education", "college"] },
  { name: "University of the Punjab Lahore", type: "University", lat: 31.5204, lng: 74.3587, category: "Education", searchTerms: ["university", "punjab", "education", "college"] },
  { name: "University of Peshawar", type: "University", lat: 34.0150, lng: 71.5249, category: "Education", searchTerms: ["university", "peshawar", "education", "college"] },
  
  // Religious Sites and Mosques
  { name: "Faisal Mosque Islamabad", type: "Mosque", lat: 33.7294, lng: 73.0381, category: "Religious", searchTerms: ["mosque", "faisal", "islamabad", "religious", "prayer"] },
  { name: "Badshahi Mosque Lahore", type: "Mosque", lat: 31.5880, lng: 74.3103, category: "Religious", searchTerms: ["mosque", "badshahi", "lahore", "religious", "prayer"] },
  { name: "Shah Faisal Mosque Islamabad", type: "Mosque", lat: 33.7294, lng: 73.0381, category: "Religious", searchTerms: ["mosque", "shah faisal", "islamabad", "religious"] },
  { name: "Wazir Khan Mosque Lahore", type: "Mosque", lat: 31.5820, lng: 74.3290, category: "Religious", searchTerms: ["mosque", "wazir khan", "lahore", "religious"] },
  
  // Shopping Centers and Malls
  { name: "Centaurus Mall Islamabad", type: "Shopping Center", lat: 33.6844, lng: 73.0479, category: "Shopping", searchTerms: ["mall", "centaurus", "shopping", "store", "retail"] },
  { name: "Dolmen Mall Karachi", type: "Shopping Center", lat: 24.8607, lng: 67.0011, category: "Shopping", searchTerms: ["mall", "dolmen", "shopping", "store", "retail"] },
  { name: "Packages Mall Lahore", type: "Shopping Center", lat: 31.5204, lng: 74.3587, category: "Shopping", searchTerms: ["mall", "packages", "shopping", "store", "retail"] },
  { name: "Giga Mall Islamabad", type: "Shopping Center", lat: 33.6844, lng: 73.0479, category: "Shopping", searchTerms: ["mall", "giga", "shopping", "store", "retail"] },
  
  // Hotels and Accommodation
  { name: "Serena Hotel Islamabad", type: "Hotel", lat: 33.6844, lng: 73.0479, category: "Accommodation", searchTerms: ["hotel", "serena", "accommodation", "stay", "lodging"] },
  { name: "Pearl Continental Hotel Karachi", type: "Hotel", lat: 24.8607, lng: 67.0011, category: "Accommodation", searchTerms: ["hotel", "pearl continental", "accommodation", "stay"] },
  { name: "Avari Hotel Lahore", type: "Hotel", lat: 31.5204, lng: 74.3587, category: "Accommodation", searchTerms: ["hotel", "avari", "accommodation", "stay", "lodging"] },
  { name: "Pearl Continental Hotel Peshawar", type: "Hotel", lat: 34.0150, lng: 71.5249, category: "Accommodation", searchTerms: ["hotel", "pearl continental", "peshawar", "accommodation"] },
  
  // Parks and Recreation
  { name: "Fatima Jinnah Park Islamabad", type: "Park", lat: 33.6844, lng: 73.0479, category: "Recreation", searchTerms: ["park", "fatima jinnah", "recreation", "garden", "outdoor"] },
  { name: "Lahore Zoo", type: "Zoo", lat: 31.5204, lng: 74.3587, category: "Recreation", searchTerms: ["zoo", "lahore", "animals", "recreation", "wildlife"] },
  { name: "Karachi Zoo", type: "Zoo", lat: 24.8607, lng: 67.0011, category: "Recreation", searchTerms: ["zoo", "karachi", "animals", "recreation", "wildlife"] },
  { name: "Lake View Park Islamabad", type: "Park", lat: 33.6844, lng: 73.0479, category: "Recreation", searchTerms: ["park", "lake view", "recreation", "garden", "outdoor"] },
  
  // Museums and Cultural Sites
  { name: "Pakistan Museum of Natural History", type: "Museum", lat: 33.7294, lng: 73.0381, category: "Culture", searchTerms: ["museum", "natural history", "culture", "exhibit", "art"] },
  { name: "Lahore Museum", type: "Museum", lat: 31.5204, lng: 74.3587, category: "Culture", searchTerms: ["museum", "lahore", "culture", "exhibit", "art"] },
  { name: "National Museum Karachi", type: "Museum", lat: 24.8607, lng: 67.0011, category: "Culture", searchTerms: ["museum", "national", "karachi", "culture", "exhibit"] },
  { name: "Peshawar Museum", type: "Museum", lat: 34.0150, lng: 71.5249, category: "Culture", searchTerms: ["museum", "peshawar", "culture", "exhibit", "art"] }
];

// User location marker
let userLocationMarker = null;

function performSearch(query) {
  if (query.length < 2) {
    hideSearchResults();
    return;
  }

  const queryLower = query.toLowerCase();
  
  // Google Maps-style search with multiple search terms
  const results = poiDatabase.filter(poi => {
    // Check name, type, category, and search terms
    return poi.name.toLowerCase().includes(queryLower) ||
           poi.type.toLowerCase().includes(queryLower) ||
           poi.category.toLowerCase().includes(queryLower) ||
           poi.searchTerms.some(term => term.includes(queryLower));
  }).slice(0, 8); // Limit to 8 results like Google Maps

  displaySearchResults(results);
}

function displaySearchResults(results) {
  searchResults.innerHTML = '';
  
  if (results.length === 0) {
    searchResults.innerHTML = '<div class="search-result-item"><span>No results found</span></div>';
  } else {
    results.forEach(poi => {
      const resultItem = document.createElement('div');
      resultItem.className = 'search-result-item';
      resultItem.innerHTML = `
        <div class="search-result-title">${poi.name}</div>
        <div class="search-result-type">${poi.type} • ${poi.category}</div>
      `;
      resultItem.addEventListener('click', () => {
        map.setView([poi.lat, poi.lng], 15);
        hideSearchResults();
        searchInput.value = '';
        clearSearch.classList.remove('visible');
        
        // Add a temporary marker for the selected location
        if (userLocationMarker) {
          map.removeLayer(userLocationMarker);
        }
        userLocationMarker = L.marker([poi.lat, poi.lng], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: '<i class="fas fa-map-marker-alt" style="color: #ef4444; font-size: 24px;"></i>',
            iconSize: [24, 24],
            iconAnchor: [12, 24]
          })
        }).addTo(map);
        
        // Remove marker after 5 seconds
        setTimeout(() => {
          if (userLocationMarker) {
            map.removeLayer(userLocationMarker);
            userLocationMarker = null;
          }
        }, 5000);
      });
      searchResults.appendChild(resultItem);
    });
  }
  
  searchResults.classList.add('visible');
}

function hideSearchResults() {
  searchResults.classList.remove('visible');
}

// Geolocation functionality
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Remove existing user location marker
        if (userLocationMarker) {
          map.removeLayer(userLocationMarker);
        }
        
        // Add new user location marker
        userLocationMarker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: '<i class="fas fa-crosshairs" style="color: #3b82f6; font-size: 24px;"></i>',
            iconSize: [24, 24],
            iconAnchor: [12, 24]
          })
        }).addTo(map);
        
        // Center map on user location
        map.setView([lat, lng], 15);
        
        // Show success message
        alert(`Your location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      },
      function(error) {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please check your browser settings.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

// Search event listeners
searchInput.addEventListener('input', (e) => {
  const query = e.target.value;
  if (query.length > 0) {
    clearSearch.classList.add('visible');
  } else {
    clearSearch.classList.remove('visible');
  }
  performSearch(query);
});

clearSearch.addEventListener('click', () => {
  searchInput.value = '';
  hideSearchResults();
  clearSearch.classList.remove('visible');
});

// Hide search results when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-container')) {
    hideSearchResults();
  }
});

// Event listeners for functionality
document.getElementById('themeToggle').addEventListener('click', toggleTheme);
document.getElementById('resetBtn').addEventListener('click', resetMap);
document.getElementById('panelToggle').addEventListener('click', togglePanel);
document.getElementById('legendToggle').addEventListener('click', toggleLegend);
document.getElementById('locationBtn').addEventListener('click', getUserLocation);

// Initialize theme icon
updateThemeIcon();

// Toggle buttons (preserved from original functionality)
document.getElementById("roadsToggle").addEventListener("change", e => {
  if (e.target.checked) map.addLayer(roadsLayer);
  else map.removeLayer(roadsLayer);
});
document.getElementById("RailwaysToggle").addEventListener("change", e => {
  if (e.target.checked) map.addLayer(RailwaysLayer);
  else map.removeLayer(RailwaysLayer);
});
document.getElementById("landuseToggle").addEventListener("change", e => {
  if (e.target.checked) map.addLayer(landuseLayer);
  else map.removeLayer(landuseLayer);
});
document.getElementById("buildingsToggle").addEventListener("change", e => {
  if (e.target.checked) map.addLayer(buildingsLayer);
  else map.removeLayer(buildingsLayer);
});
document.getElementById("transportToggle").addEventListener("change", e => {
  if (e.target.checked) map.addLayer(transportLayer);
  else map.removeLayer(transportLayer);
});

// Initialize zoom level display
document.getElementById('zoomLevel').innerText = map.getZoom();

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + R to reset map
  if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
    e.preventDefault();
    resetMap();
  }
  
  // Ctrl/Cmd + T to toggle theme
  if ((e.ctrlKey || e.metaKey) && e.key === 't') {
    e.preventDefault();
    toggleTheme();
  }
  
  // Escape to close panel
  if (e.key === 'Escape') {
    const panel = document.getElementById('layer-panel');
    if (!panel.classList.contains('collapsed')) {
      togglePanel();
    }
  }
  
  // Ctrl/Cmd + F to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault();
    searchInput.focus();
  }
  
  // Ctrl/Cmd + L to get location
  if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
    e.preventDefault();
    getUserLocation();
  }
});

// Add touch support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartY - touchEndY;
  
  // Swipe up to show panel, swipe down to hide
  if (Math.abs(diff) > swipeThreshold) {
    const panel = document.getElementById('layer-panel');
    if (diff > 0 && panel.classList.contains('collapsed')) {
      // Swipe up - show panel
      togglePanel();
    } else if (diff < 0 && !panel.classList.contains('collapsed')) {
      // Swipe down - hide panel
      togglePanel();
    }
  }
}
