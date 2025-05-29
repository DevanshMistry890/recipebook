import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import RecipeCardList from '../components/RecipeCardList';
import { SPOONACULAR_API_KEY, SPOONACULAR_BASE_URL } from '../spoonacularApi';
import classicLentilSoup from '../assets/classic-lentil-soup.jpg'; // Placeholder image

function HomePage({ currentUser }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      try {
        setLoading(true);
        // Using "random" recipes for demonstration. In a real app,
        // you might use "complex search" with no query to get popular recipes.
        const response = await fetch(
          `${SPOONACULAR_BASE_URL}/recipes/random?number=10&apiKey=${SPOONACULAR_API_KEY}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedRecipes = data.recipes.map(recipe => ({
          id: recipe.id,
          name: recipe.title,
          cookTime: recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : 'N/A',
          imageUrl: recipe.image || classicLentilSoup, // Fallback to local image
        }));
        setRecipes(formattedRecipes);
      } catch (err) {
        setError(err);
        console.error("Failed to fetch recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomRecipes();
  }, []);

  if (loading) {
    return (
        <Container className="my-4 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading recipes...</span>
            </div>
        </Container>
    );
  }

  if (error) {
    return <Container className="my-4 text-center text-danger">Error: {error.message}</Container>;
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Home Recipes</h2>
      {currentUser && <p className="text-muted">Welcome, {currentUser.email}!</p>}
      <RecipeCardList recipes={recipes} />
    </Container>
  );
}

export default HomePage;