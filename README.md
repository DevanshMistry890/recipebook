# 🍽️ Smart Recipe Recommendation Website

A responsive and feature-rich web application built with React.js, allowing users to discover, search, and manage recipes based on their preferences. The app integrates Firebase Authentication and fetches real-time data from the Spoonacular API.

🔗 Live Demo: [https://www.airecipebook.me](https://www.airecipebook.me/)

---

## 🚀 Features

- 🔐 User Authentication – Sign up, login, and logout using Firebase Email/Password
- 🍲 Recipe Discovery – Random recipes with advanced search filters
- 📋 Recipe Details – View ingredients, cooking time, servings, and step-by-step instructions
- 💾 Saved Recipes – *(Coming Soon)* Bookmark recipes for later
- 📱 Responsive Design – Works seamlessly on desktop, tablet, and mobile
- 🎨 Custom Styling – Hand-crafted CSS for a unique and consistent UI
- ♻️ Reusable Components – Modular components like buttons, dropdowns, cards, etc.
- ⭐ Font Awesome Icons – Rich iconography for improved UX

---

## 🧑‍💻 Tech Stack

| Layer     | Tools                                       |
|-----------|---------------------------------------------|
| Frontend  | React.js, Vite, React Router DOM            |
| UI Layout | React-Bootstrap (structure only)            |
| Styling   | Custom CSS (no Bootstrap theme)             |
| Auth      | Firebase Authentication                     |
| API       | Spoonacular API + Personal API              |
| Icons     | Font Awesome                                |

---

## 🔧 Installation & Setup

### Prerequisites

- Node.js & npm installed
- Firebase project with Email/Password authentication enabled
- Spoonacular API key (get it [here](https://spoonacular.com/food-api))

### Steps

bash
#### 1. Create your app
npm create vite@latest my-recipe-app -- --template react

#### 2. Install required dependencies
npm install react-router-dom react-bootstrap firebase

#### 3. Clone or copy the project files into your Vite app

## Firebase Setup
Initialize Firebase in src/firebase.js with your config object.
Enable Email/Password Authentication in your Firebase Console.

Spoonacular API Setup
Create a file src/spoonacularApi.js and store your API key and base URL.

Font Awesome Integration
Add the following to your public/index.html:


<script src="https://kit.fontawesome.com/your-kit-id.js" crossorigin="anonymous"></script>

## ▶️ Running the App
bash
npm run dev
Visit http://localhost:5173 in your browser.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 📁 Project Structure Highlights
App.jsx – Global routing and Firebase auth state tracking

Header.jsx – Dynamic navbar with login/logout handling

pages/ – Home, Find Recipe, Saved, Login, Signup, Recipe Details

components/ – Reusable UI components (Button, Dropdown, RecipeCard, etc.)

public/css/ – Custom CSS styles

assets/ – Icons and placeholder images

## 🔮 Future Roadmap
🔗 Backend Integration (MongoDB, Node.js/Express)

🧠 AI-Powered Recipe Recommendation Engine

📱 Mobile App (React Native or Flutter)

🧪 Unit & E2E Testing (Selenium, Jest)

🌐 Deployment on Netlify or Vercel

👤 User Profiles & Dietary Preferences

⭐ Recipe Rating & Review System

## 📝 License
This project is for educational purposes only and does not include a commercial license for the Spoonacular API.
