import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap'; // Import Spinner
import RecipeCardList from '../components/RecipeCardList'; // For backend recipes
import RecipeCardListSpoon from '../components/RecipeCardListSpoon'; // For Spoonacular recipes
import Footer from '../components/Footer';

import { database } from '../firebase';
import { ref, onValue, off } from 'firebase/database';

// Import your API keys and base URLs
import { SPOONACULAR_API_KEY, SPOONACULAR_BASE_URL } from '../spoonacularApi';
const BACKEND_BASE_URL = 'http://localhost:5000'; // Your backend URL

function SavedRecipesPage({ currentUser }) {
  const [backendSavedRecipes, setBackendSavedRecipes] = useState([]);
  const [spoonacularSavedRecipes, setSpoonacularSavedRecipes] = useState([]);

  // Separate loading states for each section
  const [loadingBackend, setLoadingBackend] = useState(true);
  const [loadingSpoonacular, setLoadingSpoonacular] = useState(true);
  // Separate error states for each section
  const [errorBackend, setErrorBackend] = useState(null);
  const [errorSpoonacular, setErrorSpoonacular] = useState(null);

  useEffect(() => {
    if (!currentUser || !currentUser.uid) {
      // If no user, set all loading to false as there's nothing to fetch
      setLoadingBackend(false);
      setLoadingSpoonacular(false);
      return;
    }

    // Reset states when current user changes or component mounts
    setLoadingBackend(true);
    setLoadingSpoonacular(true);
    setErrorBackend(null);
    setErrorSpoonacular(null);
    setBackendSavedRecipes([]);
    setSpoonacularSavedRecipes([]);

    const userSavedRecipesRef = ref(database, `users/${currentUser.uid}/savedRecipes`);

    // Listen for changes to the user's saved recipes in real-time
    const unsubscribe = onValue(userSavedRecipesRef, async (snapshot) => {
      const savedRecipeKeys = snapshot.val(); // { "ID_type": {type: "type"}, ... }

      if (!savedRecipeKeys) {
        // If no saved recipes in Firebase, just set loading to false and return
        setLoadingBackend(false);
        setLoadingSpoonacular(false);
        setBackendSavedRecipes([]);
        setSpoonacularSavedRecipes([]);
        return;
      }

      const backendIds = [];
      const spoonacularIds = [];

      // Separate recipe IDs by type from Firebase data
      for (const key in savedRecipeKeys) {
        if (savedRecipeKeys.hasOwnProperty(key)) {
          const { type } = savedRecipeKeys[key];
          const recipeId = key.split('_')[0]; // Extract the numerical ID

          if (type === 'backend' || type === 'recipe') {
            backendIds.push(recipeId);
          } else if (type === 'spoonacular' || type === 'spoon') {
            spoonacularIds.push(recipeId);
          }
        }
      }

      // --- Fetch Backend Recipes ---
      const fetchBackendRecipes = async () => {
        if (backendIds.length === 0) {
          setBackendSavedRecipes([]);
          setLoadingBackend(false);
          return;
        }
        try {
          // Changed to /api/summaries as discussed for efficiency
          const response = await fetch(`${BACKEND_BASE_URL}/api/summaries?ids=${backendIds.join(',')}`);

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }
          const data = await response.json();
          const formattedRecipes = data.map(recipe => ({
            id: recipe.id || recipe._id,
            name: recipe.title,
            cookTime: recipe.prepTimeMinutes ? `${recipe.prepTimeMinutes} min` : 'N/A',
            imageUrl: recipe.imageUrl,
          }));
          setBackendSavedRecipes(formattedRecipes);
        } catch (err) {
          console.error(`Error fetching backend recipe summaries:`, err);
          setErrorBackend("Failed to load recipes from your database.");
          setBackendSavedRecipes([]); // Clear previous recipes on error
        } finally {
          setLoadingBackend(false);
        }
      };

      // --- Fetch Spoonacular Recipes ---
      const fetchSpoonacularRecipes = async () => {
        if (spoonacularIds.length === 0) {
          setSpoonacularSavedRecipes([]);
          setLoadingSpoonacular(false);
          return;
        }
        try {
          const results = await Promise.all(
            spoonacularIds.map(async (id) => {
              try {
                const response = await fetch(
                  `${SPOONACULAR_BASE_URL}/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
                );
                if (!response.ok) {
                  const errorText = await response.text();
                  console.error(`Failed to fetch Spoonacular recipe ID ${id}: ${response.statusText}, message: ${errorText}`);
                  return null;
                }
                const data = await response.json();
                return {
                  id: data.id,
                  name: data.title,
                  cookTime: data.readyInMinutes ? `${data.readyInMinutes} min` : 'N/A',
                  imageUrl: data.image,
                };
              } catch (err) {
                console.error(`Error fetching Spoonacular recipe ID ${id}:`, err);
                return null;
              }
            })
          );
          setSpoonacularSavedRecipes(results.filter(Boolean)); // Filter out any failed fetches
        } catch (err) {
          console.error("Error during Spoonacular batch fetch:", err);
          setErrorSpoonacular("Failed to load recipes from Spoonacular.");
          setSpoonacularSavedRecipes([]); // Clear previous recipes on error
        } finally {
          setLoadingSpoonacular(false);
        }
      };

      // Execute both fetches concurrently
      fetchBackendRecipes();
      fetchSpoonacularRecipes();

    }, (err) => {
      // Error handling for Firebase listener itself (less common)
      console.error("Firebase saved recipes listener error:", err);
      setErrorBackend("Failed to fetch your saved recipe IDs from Firebase.");
      setErrorSpoonacular("Failed to fetch your saved recipe IDs from Firebase."); // Both affected
      setLoadingBackend(false);
      setLoadingSpoonacular(false);
    });

    // Cleanup the Firebase listener when the component unmounts
    return () => off(userSavedRecipesRef, 'value', unsubscribe);
  }, [currentUser]); // Re-run if currentUser changes

  const showNoRecipesMessage =
    !loadingBackend &&
    !loadingSpoonacular &&
    !errorBackend &&
    !errorSpoonacular &&
    backendSavedRecipes.length === 0 &&
    spoonacularSavedRecipes.length === 0;

  return (
    <>
      <Container className="my-4">
        <h2 className="mb-4 text-center">My Saved Recipes</h2>

        {!currentUser ? (
          <p className="text-center text-muted">Please log in to view your saved recipes.</p>
        ) : (
          <>
            <hr className="orange hr-11"></hr>
            {/* Section for Backend Recipes */}
            <section className="my-5">
              <h5 className="mb-3">From Database</h5>
              {loadingBackend && (
                <div className="text-center my-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted mt-2">Loading your database recipes...</p>
                </div>
              )}
              {errorBackend && <p className="text-center text-danger">{errorBackend}</p>}
              {!loadingBackend && !errorBackend && backendSavedRecipes.length > 0 && (
                <RecipeCardList recipes={backendSavedRecipes} />
              )}
              {!loadingBackend && !errorBackend && backendSavedRecipes.length === 0 && (
                <p className="text-center text-muted">No recipes saved from database yet.</p>
              )}
            </section>
            <hr></hr>
            {/* Section for Spoonacular Recipes */}
            <section className="my-5">
              <h5 className="mb-3">From External Sources </h5>
              {loadingSpoonacular && (
                <div className="text-center my-4">
                  <Spinner animation="border" variant="success" /> {/* Different color spinner */}
                  <p className="text-muted mt-2">Loading Spoonacular recipes...</p>
                </div>
              )}
              {errorSpoonacular && <p className="text-center text-danger">{errorSpoonacular}</p>}
              {!loadingSpoonacular && !errorSpoonacular && spoonacularSavedRecipes.length > 0 && (
                <RecipeCardListSpoon recipes={spoonacularSavedRecipes} />
              )}
              {!loadingSpoonacular && !errorSpoonacular && spoonacularSavedRecipes.length === 0 && (
                <p className="text-center text-muted">No recipes saved from External yet.</p>
              )}
            </section>

            {/* Overall No Recipes Message (only shows if both sections are done loading and have no recipes) */}
            {showNoRecipesMessage && (
              <p className="text-center text-muted mt-5">You haven't saved any recipes yet.</p>
            )}
          </>
        )}
      </Container>
      <Footer></Footer>
    </>
  );
}

export default SavedRecipesPage;