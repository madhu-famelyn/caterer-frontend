# CaterHub Frontend

Welcome to the frontend application of **CaterHub** — a premium catering marketplace built with **React**, **Vite**, and styled with **Vanilla CSS** for a highly polished, bespoke user experience.

---

## 🎨 Design & Experience

CaterHub is crafted with premium visual styling:
- **Elegant Theme**: Harmony of rich dark interfaces, smooth linear gradients, and sophisticated typography (e.g. Inter/Outfit).
- **Responsive Layout**: Fluid layouts across mobile, tablet, and desktop viewports.
- **Dynamic Micro-animations**: Interactive cards, smooth transitions, and hover states.

---

## 📂 Project Structure

```bash
caterer-frontend/
├── src/
│   ├── assets/          # Static assets and images
│   ├── components/      # Shared components (Navbar, Footer, CatererCard)
│   ├── pages/           # Page views:
│   │   ├── HomePage.jsx          # Welcome/landing page with hero section
│   │   ├── ExplorePage.jsx       # Grid list with searching and filters (cuisine, city)
│   │   ├── CatererProfilePage.jsx# Detail view, menus, pricing, and booking form
│   │   ├── ContactPage.jsx       # Help & support communication form
│   │   ├── LoginPage.jsx         # Access for registered caterers
│   │   └── RegisterPage.jsx      # Join form for catering businesses
│   ├── App.jsx          # Router and global layout definitions
│   ├── App.css          # Global utility configurations
│   ├── index.css        # Core custom design system and styles
│   └── main.jsx         # React application mounting
├── index.html           # Main HTML entrypoint
├── package.json         # Project manifests and scripts
├── vite.config.js       # Vite build configurations
└── .env                 # Environment configuration for backend endpoint
```

---

## 🛠️ Getting Started

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed.

### 2. Install Node Packages
Navigate to the `caterer-frontend` directory and run:
```bash
npm install
```

### 3. Environment Setup
Create a file named `.env` in the root of the frontend folder:
```ini
VITE_API_BASE_URL=http://127.0.0.1:8000
```
This tells Vite where your running FastAPI backend is located.

### 4. Start Development Server
```bash
npm run dev
```
The application will launch at **`http://localhost:5173`**.

---

## 💻 Key Features

1. **Seamless Search & Filtering**: Explore caterers dynamically using city names, cuisine types, price ranges, or a text search bar.
2. **Caterer Portal**: Allows catering businesses to sign up, update their profiles (address, tags, pricing, bio), and manage their public branding.
3. **Interactive Booking**: Guests can browse individual profiles, calculate guest totals, and interact with the caterers directly.
