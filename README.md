# 🇵🇰 Pakistan GIS Viewer

An interactive web-based GIS viewer built using **LeafletJS**, **GeoServer WMS**, and **OpenStreetMap**, with a rich set of features for visualizing spatial layers and points of interest (POIs) across Pakistan.

### 🔗 Live Demo  
[👉 View Live on GitHub Pages](https://nazare-imam38.github.io/pakistan-gis-viewer/)  
📡 Ensure `GeoServer` is running and public via [ngrok](https://ngrok.com/):  
e.g., `https://4232b18b257e.ngrok-free.app`

---

## 🗺️ Features Overview

### Core GIS Capabilities
- 🗂️ **5 WMS Layers** (from GeoServer):  
  - Roads, Railways, Landuse, Buildings, Transport
- 🎛️ **Layer Control Panel**: Toggle layers on/off with icons
- 🌐 **Live Coordinates & Zoom** displayed on map
- 🕐 **Real-time Date/Time Display**

### Google Maps–Style Search
- 🔍 **Smart POI Search**: 40+ predefined points (cities, airports, hospitals, etc.)
- ⚡ Instant fly-to with auto-zoom
- 📍 Custom red marker for selected results

### Geolocation Tools
- 📡 **GPS-based Location** Detection (with custom blue marker)
- 📌 Map auto-centers to your location
- 🧭 Shows coordinates on click

### UI & UX Highlights
- 🌑 **Dark/Light Theme Toggle**
- 📱 **Mobile-Optimized** UI + Touch Gestures
- 🧭 **Custom Icons, Animations, Panels**
- 🖱️ Mouse-based tooltips, clean legend
- ⌨️ **Keyboard Shortcuts**:
  - `Ctrl+T` – Theme toggle  
  - `Ctrl+R` – Reset view  
  - `Ctrl+L` – Get location  
  - `Ctrl+F` – Focus search  
  - `Esc` – Close panel

---

## 🛠️ Technology Stack

- **Frontend:**  
  - LeafletJS  
  - OpenStreetMap tiles  
  - FontAwesome  
  - HTML5/CSS3/JS

- **Backend:**  
  - [GeoServer](https://geoserver.org/) (WMS services)  
  - Hosted via [ngrok](https://ngrok.com/)

---

## ⚙️ Running Locally

1. Clone this repo:

```bash
git clone https://github.com/Nazare-imam38/pakistan-gis-viewer.git
cd pakistan-gis-viewer
