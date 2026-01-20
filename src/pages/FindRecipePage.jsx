import { useState, useRef, useEffect } from 'react';
import { Container, Form, Spinner } from 'react-bootstrap'; 
import InputField from '../components/InputField';
import Dropdown from '../components/Dropdown';
import RecipeCardList from '../components/RecipeCardList';
import Footer from '../components/Footer';


import { useEdgeSearch } from '../hooks/useEdgeSearch';
import { useEdgeLLM } from '../hooks/useEdgeLLM';
import fallback1 from '../assets/fallbacks/fallback.webp';

const FALLBACK_IMAGE_URLS = [fallback1];
function getRandomFallbackImageUrl() {
  const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGE_URLS.length);
  return FALLBACK_IMAGE_URLS[randomIndex];
}


function FindRecipePage({ currentUser }) {
  const { search, isReady: searchReady, isLoading: edgeLoading, status: searchStatus } = useEdgeSearch();
  const { askRecipe, isReady: llmReady, response: llmStreamResponse } = useEdgeLLM();

  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [cuisinePreferences, setCuisinePreferences] = useState('');
  const [mealType, setMealType] = useState('');

  // State
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Searching...");
  const [error, setError] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // Buffer for LLM response
  const responseBuffer = useRef("");

  useEffect(() => {
    if (llmStreamResponse && isFiltering) {
      responseBuffer.current = llmStreamResponse;
    }
  }, [llmStreamResponse, isFiltering]);

  const handleFindRecipes = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage("Searching local library...");
    setError(null);
    setSearchResults([]);
    setIsFiltering(false);
    responseBuffer.current = "";

    // Wait for the model to be ready if it isn't yet
    if (!searchReady) {
      setError(new Error(`Search Engine is loading... (${searchStatus})`));
      setLoading(false);
      return;
    }

    if (!naturalLanguageQuery.trim() || naturalLanguageQuery.length < 3) {
      setError(new Error("Please enter a meaningful recipe query (min 3 chars)."));
      setLoading(false);
      return;
    }

    try {
      console.log("Searching via Edge Engine:", naturalLanguageQuery);

      // 1. Get Candidates (Vector Search)
      // HYBRID SEARCH: Get top 100 semantically relevant results
      const candidates = await search(naturalLanguageQuery, 100);

      if (!candidates || candidates.length === 0) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      // 2. Hard Filter (Metadata Tags)
      // Filter candidates based on selected dropdowns
      const activeFilters = [dietaryRestrictions, cuisinePreferences, mealType].filter(Boolean);

      let filteredResults = candidates;

      if (activeFilters.length > 0) {
        setLoadingMessage("Filtering results...");
        filteredResults = candidates.filter(recipe => {
          if (!recipe.tags) return false;
          // Check if recipe tags include ALL selected filters
          return activeFilters.every(filter => recipe.tags.includes(filter));
        });
      }

      // 3. Display Top Results
      // If filtering leaves too few results, you might optionally show partial matches, 
      // but for "Hard Filter" we strictly show matches.
      const finalResults = filteredResults.slice(0, 20); // Top 20 relevant & filtered

      setSearchResults(formatRecipes(finalResults));

      // Clear AI Filtering state since we aren't using it
      setIsFiltering(false);
      setLoading(false);

    } catch (err) {
      setError(err);
      console.error("Failed to search recipes:", err);
      setSearchResults([]);
      setLoading(false);
      setIsFiltering(false);
    }
  };

  const formatRecipes = (list) => {
    return list.map(recipe => ({
      id: recipe.i,
      name: recipe.t,
      cookTime: recipe.score ? `${Math.round(recipe.score * 100)}% Match` : 'N/A',
      imageUrl: recipe.img || getRandomFallbackImageUrl(),
      ingredients: recipe.ing,
      instructions: recipe.ins,
    }));
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
                    {loadingMessage}
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
              <p className="text-muted mt-2">{loadingMessage}</p>
            </div>
          )}

          {/* Error message */}
          {!loading && error && <p className="text-center text-danger">Error: {error.message}</p>}


          {/* Search Results Display */}
          {!loading && !error && (
            <>
              {searchResults.length > 0 ? (
                // Display RecipeCardList if recipes are found
                <RecipeCardList recipes={searchResults} currentUser={currentUser} />
              ) : (
                // Display message if no recipes were found
                naturalLanguageQuery.trim() && <p className="text-center text-muted">No recipes found for your criteria. Try a different query!</p>
              )}
            </>
          )}

        </Container>
      </section >
      <Footer></Footer>
    </>
  );
}

export default FindRecipePage;
