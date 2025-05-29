import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import InputField from '../components/InputField';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import RecipeCardList from '../components/RecipeCardList'; // To display search results
import { SPOONACULAR_API_KEY, SPOONACULAR_BASE_URL } from '../spoonacularApi';
import classicLentilSoup from '../assets/classic-lentil-soup.jpg'; // Fallback image

function FindRecipePage({ currentUser }) {
  const [ingredients, setIngredients] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [cuisinePreferences, setCuisinePreferences] = useState('');
  const [mealType, setMealType] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFindRecipes = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearchResults([]);

    let queryParams = new URLSearchParams();
    if (ingredients) queryParams.append('query', ingredients);
    if (dietaryRestrictions) queryParams.append('diet', dietaryRestrictions);
    if (cuisinePreferences) queryParams.append('cuisine', cuisinePreferences);
    if (mealType) queryParams.append('type', mealType);
    queryParams.append('number', 12); // Fetch 12 recipes
    queryParams.append('apiKey', SPOONACULAR_API_KEY);

    try {
      const response = await fetch(
        `${SPOONACULAR_BASE_URL}/recipes/complexSearch?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const formattedResults = data.results.map(recipe => ({
        id: recipe.id,
        name: recipe.title,
        // Cook time is not directly available in complexSearch, might need to fetch details for each
        cookTime: 'N/A',
        imageUrl: recipe.image || classicLentilSoup,
      }));
      setSearchResults(formattedResults);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free', 'Ketogenic'];
  const cuisineOptions = ['Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'French', 'American'];
  const mealTypeOptions = ['Main Course', 'Dessert', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverage'];

  return (
    <Container className="my-4 p-4 shadow-sm rounded">
      <h2 className="mb-4 text-center">Find Your Recipe</h2>
      {currentUser && <p className="text-muted text-center">Logged in as: {currentUser.email}</p>}
      <Form onSubmit={handleFindRecipes}>
        <InputField
          label="Ingredients"
          placeholder="e.g., chicken, rice"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <Dropdown
          label="Dietary Restrictions"
          options={dietaryOptions}
          onSelect={setDietaryRestrictions}
        />
        <Dropdown
          label="Cuisine Preferences"
          options={cuisineOptions}
          onSelect={setCuisinePreferences}
        />
        <Dropdown
          label="Meal Type"
          options={mealTypeOptions}
          onSelect={setMealType}
        />
        <Button text="Find Recipes" type="submit" />
      </Form>

      <hr className="my-5" />

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading recipes...</span>
          </div>
        </div>
      )}
      {error && <p className="text-center text-danger">Error: {error.message}</p>}
      {searchResults.length > 0 && (
        <>
          <h3 className="mb-4 text-center">Search Results</h3>
          <RecipeCardList recipes={searchResults} />
        </>
      )}
      {searchResults.length === 0 && !loading && !error && ingredients && (
        <p className="text-center text-muted">No recipes found for your criteria. Try different inputs.</p>
      )}
    </Container>
  );
}

export default FindRecipePage;