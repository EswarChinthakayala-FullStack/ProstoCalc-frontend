# ProstoCalc Frontend

The interactive, high-performance web interface for the **ProstoCalc** dental clinic ecosystem.

## 🚀 Overview

ProstoCalc Frontend leverages modern web technologies to provide a seamless, clinical-grade experience for both patients and clinicians. Built with performance, accessibility, and modern aesthetics in mind.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: 
  - [TailwindCSS v4](https://tailwindcss.com/)
  - [Framer Motion](https://www.framer.com/motion/) for animations.
  - [Shadcn UI](https://ui.shadcn.com/) components.
- **Data Visualization**: [Recharts](https://recharts.org/)
- **3D Rendering**: [Three.js](https://threejs.org/) via `@react-three/fiber` and `@react-three/drei`.
- **Mapping**: [Leaflet](https://leafletjs.org/) & [Maplibre GL](https://maplibre.org/).
- **Content**: [React Markdown](https://github.com/remarkjs/react-markdown) and Markdown Editor.

---

## ✨ Key Features

### 1. **Dashboards**
- **Clinician Dashboard**: Real-time patient analytics, request management, and dental registry.
- **Patient Hub**: Personalized health tracking, consultation history, and treatment progress.

### 2. **Clinical Tools**
- **Secure Consultation Hub**: Real-time encrypted communication between patients and dentists.
- **Interactive Odontogram**: Digital mapping of tooth-specific treatments.
- **Cost Estimator**: Dynamic pricing simulator for complex dental procedures.

### 3. **Health & AI Integration**
- **AI Diagnostics**: Direct chat interface for AI-assisted clinical guidance.
- **Health Trackers**: Specialized tools for tracking mouth opening, medication schedules, and habit recovery.

### 4. **Modern UI/UX**
- **Theme Support**: Dark/Light mode synchronization.
- **Lottie Animations**: Engaging splash loaders and micro-interactions.
- **Responsive Design**: Mobile-first architecture with dedicated drawer-based navigation for small screens.

---

## 📦 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/EswarChinthakayala-FullStack/ProstoCalc-frontend.git
   cd ProstoCalc-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory (refer to `.env.example`) with:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🏗 Project Structure

- `src/components`: Reusable UI components and domain-specific building blocks.
- `src/pages`: Top-level page components (Auth, Dashboards, Clinical tools).
- `src/hooks`: Custom React hooks for data fetching, media queries, and specialized state.
- `src/context`: Global state providers (Authentication, Theme, Notifications).
- `src/services`: API abstraction layer and external service integrations.

---

Developed with ❤️ for ProstoCalc.
