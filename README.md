# 🗺️ BC Government Burn Severity Map

This is a GeoBC lightweight web mapping application demo built with **React**, **Leaflet**, and **React Router**, featuring BCGov-branded UI components. It includes a simple landing page and an interactive map page with a responsive layout and clean structure.

## 🚀 Features

- 🔁 Client-side routing with React Router  
- 🗺️ Interactive map powered by Leaflet  
- 🧭 Clean and modular component structure  
- 🎨 BCGov-branded layout with header and footer  
- 📦 SCSS support for modular styling  

## 📁 Project Structure
```
src/
│
├── components/
│   └── bcgov-components.tsx     # PageHeader and PageFooter components
│
├── pages/
│   ├── LandingPage.tsx          # Home page with navigation
│   └── MapPage.tsx              # Page with embedded Leaflet map
│
├── components/
│   └── map.tsx                  # LeafletMap logic and initialization
│
├── utils/
│   └── mapUtils.ts              # Leaflet map config and setup functions
│
├── style.scss                   # Global SCSS styling
├── index.tsx                    # Main entry point and route setup
```
## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/leaflet-map-viewer.git
cd leaflet-map-viewer
```

2. **Install dependencies**
```bash
npm install
```

2. **Start the development server**
```bash
npm run dev
```

## 🧭 Usage
- Home ( / ) – Simple landing page with a link to the map.
- Map ( /map ) – Loads an interactive Leaflet map constrained to specific bounds and zoom levels

## 🛠️ Technologies Used
- React
- Leaflet
- React Router
- SCSS
- BCGov Design System
