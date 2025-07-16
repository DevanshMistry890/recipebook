import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, set, remove, onValue, off } from 'firebase/database';

function SaveRecipeButton({ currentUser, recipeId, recipeType }) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const dbKey = `${recipeId}_${recipeType}`;

  useEffect(() => {
    if (!currentUser || !currentUser.uid) {
      setIsSaved(false); // Not logged in, so cannot be saved by this user
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const userRecipeRef = ref(database, `users/${currentUser.uid}/savedRecipes/${dbKey}`);

    // Listen for changes to this specific recipe's saved status
    const unsubscribe = onValue(userRecipeRef, (snapshot) => {
      setIsSaved(snapshot.exists()); // If snapshot exists, it means the recipe is saved
      setLoading(false);
    }, (err) => {
      console.error("Firebase fetch error:", err);
      setError("Failed to check saved status.");
      setLoading(false);
    });

    // Cleanup listener on component unmount or when dependencies change
    return () => off(userRecipeRef, 'value', unsubscribe);
  }, [currentUser, dbKey]); // Re-run if user changes or recipe changes

  const handleSaveToggle = async () => {
    if (!currentUser || !currentUser.uid) {
      alert("Please log in to save recipes!");
      return;
    }

    setLoading(true);
    setError(null);
    const userRecipeRef = ref(database, `users/${currentUser.uid}/savedRecipes/${dbKey}`);

    try {
      if (isSaved) {
        // Unsave the recipe
        await remove(userRecipeRef);
        console.log(`Recipe ${dbKey} unsaved successfully!`);
        // setIsSaved(false); // onValue listener will update this
      } else {
        // Save the recipe
        await set(userRecipeRef, {
          type: recipeType,
          timestamp: new Date().toISOString() // Optional: add a timestamp
        });
        console.log(`Recipe ${dbKey} saved successfully!`);
        // setIsSaved(true); // onValue listener will update this
      }
    } catch (err) {
      console.error("Firebase save/delete error:", err);
      setError(`Failed to ${isSaved ? 'unsave' : 'save'} recipe.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <a href="#0" className="opacity-50" title="Loading..." aria-disabled="true"><i className="far fa-save" style={{ fontSize: 25 }}></i></a>;
  }

  if (error) {
    return <a href="#0" className="text-danger" title={error}><i className="far fa-save" style={{ fontSize: 25 }}></i></a>;
  }

  return (
    <li>
      <a
        href="#0"
        onClick={handleSaveToggle}
        className={isSaved ? "text-primary" : ""}
        title={isSaved ? "Unsave Recipe" : "Save Recipe"}
      >
        <i className={isSaved ? "fas fa-bookmark" : "far fa-bookmark"} style={{ fontSize: 25 }}></i>
      </a>
      {/* You could add a small text confirmation here if preferred */}
      {/* {isSaved && <span className="ms-2 text-success">Saved!</span>} */}
    </li>
  );
}

export default SaveRecipeButton;