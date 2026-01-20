import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { auth } from './firebase'; // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged

import Header from './components/Header';
import HomePage from './pages/HomePage';
import FindRecipePage from './pages/FindRecipePage';
import SavedRecipesPage from './pages/SavedRecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeDetailSpoon from './pages/RecipeDetailSpoon';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage'; // New SignUp page
import MembershipPage from './pages/MembershipPage';
import TestSearchPage from './pages/TestSearchPage';

function App() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // To prevent flickering

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const getActiveTab = () => {
    if (location.pathname === '/') return 'Home';
    if (location.pathname === '/find') return 'Find Recipe';
    if (location.pathname === '/saved') return 'Saved';
    return '';
  };

  // Don't render anything until auth state is determined to prevent header flicker
  if (loadingAuth) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {location.pathname !== '/login' && location.pathname !== '/signup' && (
        <Header activeTab={getActiveTab()} currentUser={currentUser} />
      )}
      <Routes>
        <Route path="/" element={<HomePage currentUser={currentUser} />} />
        <Route path="/find" element={<FindRecipePage currentUser={currentUser} />} />
        <Route path="/saved" element={<SavedRecipesPage currentUser={currentUser} />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage currentUser={currentUser} />} />
        <Route path="/spoon/:id" element={<RecipeDetailSpoon currentUser={currentUser} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/membership" element={<MembershipPage currentUser={currentUser} />} />
        <Route path="/test" element={<TestSearchPage />} />
      </Routes>
    </div>
  );
}

export default App;