import React from 'react';
import { Container } from 'react-bootstrap';
import RecipeCardList from '../components/RecipeCardList';
import classicLentilSoup from '../assets/classic-lentil-soup.jpg'; // Placeholder image

function SavedRecipesPage({ currentUser }) {
  // In a real application, you would fetch saved recipes for the currentUser
  // from your database (e.g., Firebase Firestore).

  const savedRecipes = currentUser ? [
    { id: '101', name: 'User\'s Saved Lentil Soup', cookTime: '45 min', imageUrl: classicLentilSoup },
    { id: '102', name: 'User\'s Spicy Chicken', cookTime: '50 min', imageUrl: classicLentilSoup },
    { id: '103', name: 'User\'s Creamy Pasta', cookTime: '30 min', imageUrl: classicLentilSoup },
    { id: '104', name: 'User\'s Veggie Stew', cookTime: '60 min', imageUrl: classicLentilSoup },
    { id: '105', name: 'Another Saved Recipe', cookTime: '35 min', imageUrl: classicLentilSoup },
    { id: '106', name: 'Favorite Salad', cookTime: '15 min', imageUrl: classicLentilSoup },
  ] : [];

  return (
    <Container className="my-4">
      <h2 className="mb-4">Saved Recipes</h2>
      {!currentUser ? (
        <p className="text-center text-muted">Please log in to view your saved recipes.</p>
      ) : savedRecipes.length > 0 ? (
        <>
          <p className="text-muted">Recipes saved by {currentUser.email}:</p>
          <RecipeCardList recipes={savedRecipes} />
        </>
      ) : (
        <p className="text-center text-muted">You haven't saved any recipes yet.</p>
      )}
    </Container>
  );
}

export default SavedRecipesPage;