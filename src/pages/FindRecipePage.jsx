import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import InputField from '../components/InputField';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import RecipeCardList from '../components/RecipeCardList'; // To display search results


const BACKEND_BASE_URL = 'http://localhost:5000';


function FindRecipePage({ currentUser }) {
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [cuisinePreferences, setCuisinePreferences] = useState('');
  const [mealType, setMealType] = useState('');

  // State variables for the LLM's response and formatted recipes for cards
  const [llmResponse, setLlmResponse] = useState(null);
  const [searchResults, setSearchResults] = useState([]); // Formatted data for RecipeCardList

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFindRecipes = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLlmResponse(null); // Clear previous LLM response
    setSearchResults([]); // Clear previous search results

    if (!naturalLanguageQuery) {
      setError(new Error("Please enter a query for the recipe search."));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/recipes/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: naturalLanguageQuery }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend RAG Response:", data);

      // Set the LLM's generated response
      setLlmResponse(data.llm_response);

      // Format retrieved_recipes for RecipeCardList component
      if (data.retrieved_recipes && Array.isArray(data.retrieved_recipes)) {
        const formattedForCardList = data.retrieved_recipes.map(recipe => ({
          id: recipe._id || recipe.title.replace(/\s+/g, '-').toLowerCase(), // Use _id, fallback to title-based ID
          name: recipe.title,
          cookTime: recipe.score ? `${Math.round(recipe.score * 100)}% Match` : 'N/A',
          imageUrl: recipe.imageUrl, // You'll need logic to get actual images if desired
          ingredients: recipe.ingredients, // Keep for potential future detail pages
          instructions: recipe.instructions, // Keep for potential future detail pages
        }));
        setSearchResults(formattedForCardList);
      }

    } catch (err) {
      setError(err);
      console.error("Failed to fetch recipes from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free', 'Ketogenic'];
  const cuisineOptions = ['Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'French', 'American'];
  const mealTypeOptions = ['Main Course', 'Dessert', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverage'];

  return (
    <section className="tstbite-components py-5 bg-lightest-gray">
      <Container className="bg-white p-4 p-md-5 rounded">
        <div className="text-center mb-4">
          <h2 className="mb-2 h1">Find Your Recipe</h2>
          {currentUser && (
            <p className="text-muted small">
              Logged in as: <span className="text-dark">{currentUser.email}</span>
            </p>
          )}
        </div>

        <Form onSubmit={handleFindRecipes}>
          <div className="mb-4">
            <InputField
              label="What kind of recipe are you looking for?"
              placeholder="e.g., How to make Tomato Chicken Marsala?"
              value={naturalLanguageQuery}
              onChange={(e) => setNaturalLanguageQuery(e.target.value)}
            />
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <Dropdown
                label="Dietary Restrictions"
                options={dietaryOptions}
                onSelect={setDietaryRestrictions}
                disabled={true}
              />
            </div>
            <div className="col-md-4 mb-3">
              <Dropdown
                label="Cuisine Preferences"
                options={cuisineOptions}
                onSelect={setCuisinePreferences}
                disabled={true}
              />
            </div>
            <div className="col-md-4 mb-3">
              <Dropdown
                label="Meal Type"
                options={mealTypeOptions}
                onSelect={setMealType}
                disabled={true}
              />
            </div>
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-primary px-4 py-2">
              Find Recipes
            </button>
          </div>
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
            <h3 className="mb-4 text-center">Relevant Recipes</h3>
            <RecipeCardList recipes={searchResults} />
          </>
        )}

        {!loading && !error && !llmResponse && searchResults.length === 0 && naturalLanguageQuery && (
          <p className="text-center text-muted">No recipes found for your criteria.</p>
        )}
      </Container>
    </section>
  );
}

export default FindRecipePage;