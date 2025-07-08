🍽️ Smart Recipe Recommendation Website
A responsive and feature-rich web application built with React.js, allowing users to discover, search, and manage recipes based on their preferences. The app integrates Firebase Authentication and fetches real-time data from the Spoonacular API.

See Development Live server: https://devanshmistry890.github.io/recipebook/
🚀 Features
🔐 User Authentication – Sign up, login, and logout with Firebase Email/Password authentication

🍲 Recipe Discovery – View random recipes and use advanced search filters

📋 Recipe Details – Ingredients, cook time, servings, and step-by-step instructions

💾 Saved Recipes – (Coming soon) Users can bookmark recipes

📱 Responsive Design – Optimized for mobile, tablet, and desktop

🎨 Custom Styling – Built with hand-crafted CSS for a unique UI

♻️ Reusable Components – Buttons, dropdowns, inputs, and cards

⭐ Font Awesome Icons – Seamless UI-enhancing vector icons

🧑‍💻 Tech Stack
Layer	Tools
Frontend	React.js, Vite, React Router DOM
UI Layout	React-Bootstrap (structure only)
Styling	Custom CSS (no Bootstrap theme)
Auth	Firebase Authentication
API	Spoonacular API
Icons	Font Awesome

🔧 Installation & Setup
Prerequisites
Node.js & npm

Firebase project with Email/Password auth enabled

Spoonacular API key (get it here)

Steps
bash
Copy
Edit
# 1. Create your app
npm create vite@latest my-recipe-app -- --template react

# 2. Install required dependencies
npm install react-router-dom react-bootstrap firebase

# 3. Clone or copy the project files into your Vite app
Firebase Setup
In src/firebase.js, initialize Firebase using your config object.

Enable Email/Password Authentication in the Firebase Console.

Spoonacular API
Store your API key and base URL in src/spoonacularApi.js.

Font Awesome Integration
In public/index.html, add:

html
Copy
Edit
<script src="https://kit.fontawesome.com/your-kit-id.js" crossorigin="anonymous"></script>
▶️ Running the App
bash
Copy
Edit
npm run dev
Visit http://localhost:5173 to view your app in the browser.

📁 Project Structure Highlights
App.jsx – Global routing and Firebase auth state tracking

Header.jsx – Dynamic nav bar with login/logout handling

pages/ – Home, Find Recipe, Saved, Login, Signup, Recipe Details

components/ – Reusable UI: Button, Dropdown, InputField, RecipeCard

public/css/ – Custom CSS files for styling

assets/ – Placeholder images

🔮 Future Roadmap
🔗 Backend Integration (MongoDB/Node.js)

🧠 AI Recommendation Engine

📱 Mobile App (React Native or Flutter)

🧪 Unit & E2E Testing

🌐 Deployment on Netlify or Vercel

👤 User Profiles & Dietary Preferences

⭐ Recipe Rating & Review System

📝 License
This project is for educational purposes and does not include a commercial license for the Spoonacular API.
