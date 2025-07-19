import React, { useState } from 'react';
import { Container, Form, Spinner } from 'react-bootstrap'; // Import Spinner for loading
import InputField from '../components/InputField';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button'; // Assuming you use this for the submit button
import RecipeCardList from '../components/RecipeCardList';
import Footer from '../components/Footer';


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

    if (!naturalLanguageQuery.trim() ||
      naturalLanguageQuery.length < 5) {
      setError(new Error("Please enter a meaningful recipe query."));
      setLoading(false);
      return;
    }

    if (!/[a-zA-Z]/.test(naturalLanguageQuery)) {
      setError(new Error("Query must include at least one alphabet character."));
      setLoading(false);
      return;
    }

    if (naturalLanguageQuery.length > 500) {
      setError(new Error("Query must be 500 characters or less."));
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        query: naturalLanguageQuery,
        dietaryRestrictions: dietaryRestrictions || null, // Send null if empty string
        cuisinePreferences: cuisinePreferences || null,   // Send null if empty string
        mealType: mealType || null,                       // Send null if empty string
      };

      console.log("Sending request to backend:", requestBody); // For debugging

      const response = await fetch(`${BACKEND_BASE_URL}/api/recipes/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody), // Send the complete requestBody
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
          id: recipe._id || recipe.title.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now(), // Add Date.now() for uniqueness if _id is missing
          name: recipe.title,
          cookTime: recipe.score ? `${Math.round(recipe.score * 100)}% Match` : 'N/A',
          imageUrl: recipe.imageUrl,
          // Ensure these are passed if RecipeCard (or detail page) expects them:
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          // You might want to pass the full recipe object to RecipeCard
          // if your RecipeCard or the detail page uses it directly for full display.
          // For now, these specific fields are sufficient for the card display.
        }));
        setSearchResults(formattedForCardList);
      } else {
        setSearchResults([]); // Ensure empty array if no recipes are retrieved
      }

    } catch (err) {
      setError(err);
      console.error("Failed to fetch recipes from backend:", err);
      setSearchResults([]); // Clear results on error
    } finally {
      setLoading(false);
    }
  };

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free', 'Ketogenic'];
  const cuisineOptions = ['Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'French', 'American'];
  const mealTypeOptions = ['Main Course', 'Dessert', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverage'];

  return (
    <>
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
                maxLength={500}
              />
              <div className="text-end">
                <small
                  className={
                    naturalLanguageQuery.length > 500
                      ? 'text-danger'
                      : 'text-muted'
                  }
                >
                  {naturalLanguageQuery.length}/500 characters
                  {naturalLanguageQuery.length > 500 && ' (Too long)'}
                </small>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <Dropdown
                  label="Dietary Restrictions"
                  options={dietaryOptions}
                  onSelect={setDietaryRestrictions}
                // Removed disabled={true}
                />
              </div>
              <div className="col-md-4 mb-3">
                <Dropdown
                  label="Cuisine Preferences"
                  options={cuisineOptions}
                  onSelect={setCuisinePreferences}
                // Removed disabled={true}
                />
              </div>
              <div className="col-md-4 mb-3">
                <Dropdown
                  label="Meal Type"
                  options={mealTypeOptions}
                  onSelect={setMealType}
                // Removed disabled={true}
                />
              </div>
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary px-4 py-2" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Searching...
                  </>
                ) : (
                  'Find Recipes'
                )}
              </button>
            </div>
          </Form>

          <hr className="my-5" />

          {/* Loading indicator */}
          {loading && (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-2">Searching for recipes...</p>
            </div>
          )}

          {/* Error message */}
          {!loading && error && <p className="text-center text-danger">Error: {error.message}</p>}


          {/* Search Results Display */}
          {!loading && !error && searchResults.length > 0 && (
            <>
              <h3 className="mb-4 text-center">Relevant Recipes</h3>
              <RecipeCardList recipes={searchResults} />
            </>
          )}

          {/* No recipes found message (only show if not loading, no error, no results, and a query was made) */}
          {!loading && !error && searchResults.length === 0 && naturalLanguageQuery.trim() && !llmResponse && (
            <p className="text-center text-muted">No recipes found for your criteria. Try a different query!</p>
          )}

        </Container>
      </section>
      <Footer></Footer>
    </>
  );
}

export default FindRecipePage;