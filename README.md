# 🗺️ BC Government Burn Severity Map

This is a GeoBC lightweight web mapping application demo built with **React**, **Leaflet**, and **React Router**, featuring BCGov-branded UI components. It includes a simple landing page and an interactive map page with a responsive layout and clean structure.

## 🚀 Frontend Features

- 🔁 Client-side routing with React Router  
- 🗺️ Interactive map powered by Open Layers 
- 🧭 Messy and modular component structure  
- 🎨 BCGov-branded layout with header and footer  
- 📦 SCSS support for modular styling  

## 🚀 Backend Features

- 🧭 Fastapi with authenticated routes, duckdb, geoparquet, pydantic

## 📁 Project Structure
```
frontend/src/                    # Frontend component
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
|
backend/                         # Backend component
|── api                          # fastapi
|── bs-worker                    # utilities for loading source data to parquet
|── 
charts/                          # Helm deployment charts
|── templates
│   ├── backend
│       ├── _helpers.yaml
│       ├── deployment.yaml
│       ├── hpa.yaml
│       ├── pdb.yaml
│       ├── service.yaml
│   ├── frontend
│       ├── *.yaml
|   ├── chart.yaml
|   ├── values.yaml
|── 
```
## 📦 Frontend Dev Installation

1. **Clone the repository**

```bash
git clone https://github.com/bcgov/burn-severity-map.git
cd burn-severity-map
```

2. **Start the backend and database containers**
```bash
docker-compose up fastapi-backend postgres -d
```
your backend api should be at 
http://localhost:8000
Interactive API documentation:
http://localhost:8000/docs  
Backend developers may wish to run the api from venv. Use docker to start only the database with  
```bash
docker-compose up postgres -d
```
Stop your database with
```bash
docker-compose down
```
Start the backend with UV
```bash
uv run python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

3. **Install front end dependencies**
```bash
cd frontend
npm install
```

4. **Start the development server**
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
