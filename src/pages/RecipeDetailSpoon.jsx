import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; // Removed useLocation as 'source' is no longer needed
import { Container, Row, Col, Image } from 'react-bootstrap';

// Keep Spoonacular API details since this component is now dedicated to it
import { SPOONACULAR_API_KEY, SPOONACULAR_BASE_URL } from '../spoonacularApi';

import NewsletterBox from '../components/NewsletterBox';
import Footer from '../components/Footer';
import '../assets/css/extra.css';

// Import your random fallback image assets and utility functions
import fallback1 from '../assets/fallbacks/fallback.webp';
import SaveRecipeButton from '../components/SaveRecipeButton.jsx';


// Define the array of all fallback image URLs
const FALLBACK_IMAGE_URLS = [
  fallback1,
  // Add more fallback images here if you have them, e.g.:
  // import fallback2 from '../assets/fallbacks/food_fallback_2.png';
  // fallback2,
];

// Function to get a random fallback image URL
function getRandomFallbackImageUrl() {
  const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGE_URLS.length);
  return FALLBACK_IMAGE_URLS[randomIndex];
}


function RecipeDetailSpoon({ currentUser }) {
  const { id } = useParams();
  // Removed: const location = useLocation();
  const recipeType = 'spoon';

  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State and Ref for image handling
  const [currentDisplayImageSrc, setCurrentDisplayImageSrc] = useState(null);
  const hasFallbackAttempted = useRef(false);

  // Handle image loading errors for the main image
  const handleDetailImageError = () => {
    if (!hasFallbackAttempted.current) {
      setCurrentDisplayImageSrc(getRandomFallbackImageUrl());
      hasFallbackAttempted.current = true;
    } else {
      console.warn(`Detail page fallback image also failed to load for recipe ID: ${id}`);
    }
  };

  // --- Print functionality ---
  const handlePrint = () => {
    window.print();
  };

  // --- Share functionality (Copy URL to clipboard) ---
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Recipe link copied to clipboard!'); // Simple popup notification
    } catch (err) {
      console.error('Failed to copy URL to clipboard:', err);
      alert('Failed to copy link. Please try again.'); // Error notification
    }
  };

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setRecipeData(null); // Clear previous data
        hasFallbackAttempted.current = false; // Reset fallback attempt status

        console.log(`Fetching recipe details from Spoonacular for ID: ${id}`);
        const response = await fetch(
          `${SPOONACULAR_BASE_URL}/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true` // Request nutrition data
        );
        if (!response.ok) {
          throw new Error(`Spoonacular HTTP error! status: ${response.status}`);
        }
        const fetchedData = await response.json();
        console.log('Fetched data from Spoonacular:', fetchedData);

        // --- Map Spoonacular data to a structure similar to your backend's ---
        // Ensuring ingredients and instructions are arrays of strings.
        // Nutrition is also extracted if available.
        const mappedIngredients = fetchedData.extendedIngredients
          ? fetchedData.extendedIngredients.map(ing => ing.original)
          : [];

        // Spoonacular instructions can sometimes be a single HTML string or nested steps
        let mappedInstructions = [];
        if (fetchedData.analyzedInstructions && fetchedData.analyzedInstructions.length > 0) {
          // Extract steps from analyzedInstructions if available
          fetchedData.analyzedInstructions[0].steps.forEach(step => {
            mappedInstructions.push(step.step);
          });
        } else if (fetchedData.instructions) {
          // Fallback to simple string if analyzedInstructions isn't present, and split by newline
          mappedInstructions = fetchedData.instructions
            .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
            .split('\n')
            .filter(step => step.trim() !== ''); // Filter out empty strings
        }

        const mappedNutrition = fetchedData.nutrition?.nutrients ?
          fetchedData.nutrition.nutrients.reduce((acc, nutrient) => {
            // Map common nutrition fields to match your backend's 'perServing' format
            if (nutrient.name === 'Calories') acc.calories = Math.round(nutrient.amount);
            if (nutrient.name === 'Fat') acc.totalFat = Math.round(nutrient.amount);
            if (nutrient.name === 'Saturated Fat') acc.saturatedFat = Math.round(nutrient.amount);
            if (nutrient.name === 'Carbohydrates') acc.carbohydrates = Math.round(nutrient.amount);
            if (nutrient.name === 'Sugar') acc.sugar = Math.round(nutrient.amount);
            if (nutrient.name === 'Protein') acc.protein = Math.round(nutrient.amount);
            return acc;
          }, {}) : null;


        setRecipeData({
          id: fetchedData.id,
          name: fetchedData.title || 'Recipe Name',
          imageUrl: fetchedData.image,
          cookTime: fetchedData.readyInMinutes ? `${fetchedData.readyInMinutes} min` : 'N/A',
          serves: fetchedData.servings ? `${fetchedData.servings} Persons` : 'N/A',
          // Remove HTML tags from summary for a cleaner text description
          description: fetchedData.summary ? fetchedData.summary.replace(/<\/?[^>]+(>|$)/g, "") : 'No description available.',
          ingredients: mappedIngredients,
          instructions: mappedInstructions.length > 0 ? mappedInstructions : ['No instructions available.'],
          nutrition: mappedNutrition
        });

        setCurrentDisplayImageSrc(fetchedData.image || getRandomFallbackImageUrl());

      } catch (err) {
        setError(err);
        console.error("Failed to fetch recipe details:", err);
        setCurrentDisplayImageSrc(getRandomFallbackImageUrl()); // Set a random fallback on fetch error
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipeDetails();
    }
  }, [id]); // Depend only on 'id' now

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading recipe details...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return <Container className="my-4 text-center text-danger">Error: {error.message}</Container>;
  }

  if (!recipeData) {
    return <Container className="my-4">Recipe not found.</Container>;
  }

  return (
    <>
      <div className="container">
        <section className="tstbite-components my-4 my-md-5">
          <div className="d-sm-flex">
            <div className="tstbite-svg order-sm-2 ms-auto">
              <div className="tstbite-feature pt-0">
                {/* Share Icon */}
                <a href="#0" onClick={handleShare} title="Copy Recipe Link">
                  <svg data-name="feather-icon/share" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                    <rect data-name="Bounding Box" width="32" height="32" fill="rgba(255,255,255,0)" />
                    <path d="M4,29.333a4,4,0,0,1-4-4V14.666a1.333,1.333,0,1,1,2.666,0V25.333A1.333,1.333,0,0,0,4,26.666H20a1.333,1.333,0,0,0,1.333-1.333V14.666a1.333,1.333,0,1,1,2.666,0V25.333a4,4,0,0,1-4,4Zm6.667-10.666V4.552L7.609,7.609A1.333,1.333,0,0,1,5.724,5.724L11.057.39a1.333,1.333,0,0,1,.307-.229h0l.025-.013.008,0,.018-.009.015-.007.011-.005.024-.011h0a1.338,1.338,0,0,1,1.062,0h0l.024.011.011,0,.016.008L12.6.143l.008,0,.025.013h0a1.333,1.333,0,0,1,.307.229l5.333,5.334a1.333,1.333,0,1,1-1.885,1.885L13.333,4.552V18.667a1.333,1.333,0,0,1-2.666,0Z" transform="translate(4 1.333)" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div>
            <strong>
              <svg data-name="feather-icon/trending-up" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <rect data-name="Bounding Box" width="20" height="20" fill="rgba(255,255,255,0)"></rect>
                <path d="M.244,11.423a.834.834,0,0,1,0-1.178L6.494,3.994a.834.834,0,0,1,1.178,0L11.25,7.571l5.9-5.9H14.167a.833.833,0,1,1,0-1.667h5A.833.833,0,0,1,20,.833v5a.834.834,0,0,1-1.667,0V2.845L11.839,9.339a.834.834,0,0,1-1.179,0L7.083,5.761l-5.66,5.661a.834.834,0,0,1-1.179,0Z" transform="translate(0 4.167)" fill="#ff642f"></path>
              </svg>
              <span className="ms-2 caption font-weight-medium">85% would make this again</span>
            </strong>
            <h5 className="py-3 mb-0 h2">{recipeData.name}</h5>
          </div>
          <div className="blog-detail">
            <hr></hr>
            <div className="rounded-12 overflow-hidden position-relative tstbite-svg">
              <img
                src={currentDisplayImageSrc}
                srcSet={`
                  ${currentDisplayImageSrc}?w=320 320w,
                  ${currentDisplayImageSrc}?w=640 640w,
                  ${currentDisplayImageSrc}?w=1280 1280w
                `}
                sizes="(max-width: 576px) 320px, (max-width: 992px) 640px, 1280px"
                alt={recipeData.name}
                className="mb-3 w-100 img-fluid rounded"
                loading="lazy"
                onError={handleDetailImageError}
                style={{ aspectRatio: '16/9', objectFit: 'cover' }}
              />
            </div>
            <br></br>
            <div className="row mt-0 mt-md-5">
              <div className="col-lg-8 col-md-7">
                <div className="border-md-end pe-0 pe-lg-5">
                  <ul className="list-unstyled component-list tstbite-svg">
                    <li>
                      <small>Prep Time</small>
                      <span>{recipeData.cookTime}</span>
                    </li>
                    <li>
                      <small>Servings</small>
                      <span>{recipeData.serves}</span>
                    </li>
                    <li>
                      {/* Print Icon */}
                      <a href="#0" onClick={handlePrint} title="Print Recipe">
                        <svg data-name="feather-icon/printer" xmlns="http://www.w3.org/2000/svg" width="20" height="22.041" viewBox="0 0 20 22.041">
                          <rect data-name="Bounding Box" width="20" height="22.041" fill="rgba(255,255,255,0)" />
                          <path d="M4.166,20.2a.88.88,0,0,1-.833-.918V16.531H2.5A2.636,2.636,0,0,1,0,13.776V9.184A2.636,2.636,0,0,1,2.5,6.429h.833V.918A.879.879,0,0,1,4.167,0h10A.878.878,0,0,1,15,.918v5.51h.833a2.636,2.636,0,0,1,2.5,2.755v4.592a2.636,2.636,0,0,1-2.5,2.755H15v2.755a.88.88,0,0,1-.834.918ZM5,18.367h8.333v-5.51H5v2.718c0,.012,0,.025,0,.038s0,.025,0,.037Zm10.834-3.673a.879.879,0,0,0,.833-.918V9.184a.878.878,0,0,0-.833-.918H2.5a.879.879,0,0,0-.833.918v4.592a.879.879,0,0,0,.833.918h.833V11.938a.88.88,0,0,1,.833-.918h10a.88.88,0,0,1,.834.918v2.756Zm-2.5-8.265V1.837H5V6.429Z" transform="translate(0.833 0.918)" />
                        </svg>
                      </a>
                    </li>
                    <SaveRecipeButton
                        currentUser={currentUser}
                        recipeId={recipeData.id}
                        recipeType={recipeType}
                      />
                  </ul>

                  <div className="mt-4 mt-md-5">
                    <h6>Description</h6>
                    {/* Display description directly */}
                    <p className="text-muted">{recipeData.description}</p>
                  </div>

                  <div className="mt-4 mt-md-5">
                    <h6>Ingredients</h6>
                    <div className="checklist pb-2">
                      {recipeData.ingredients.length > 0 ? (
                        <div className="list-unstyled">
                          {recipeData.ingredients.map((ingredient, index) => (
                            <div key={index} className="form-check form-check-rounded recipe-checkbox">
                              <input
                                type="checkbox"
                                id={`ingredient-${index}`}
                                name={`ingredient-${index}`}
                                className="form-check-input"
                              />
                              <label className="form-check-label" htmlFor={`ingredient-${index}`}>
                                {ingredient}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">No ingredients listed.</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 mt-md-5">
                    <h6>Instructions</h6>
                    {recipeData.instructions.length > 0 ? (
                      <ul className="instruction-list list-unstyled">
                        {recipeData.instructions.map((instruction, index) => (
                          <li key={index}><span>{index + 1}</span> {instruction}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No instructions listed.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-5">
                {recipeData.nutrition && (
                  <div className="rounded-12 bg-lightest-gray p-4">
                    <h6>Nutrition Facts</h6>
                    <ul className="Nutrition-list list-unstyled">
                      {/* Only render if nutrition data exists */}
                      {recipeData.nutrition.calories && (
                        <li>
                          <span>Calories</span>
                          <span>{recipeData.nutrition.calories} kcal</span>
                        </li>
                      )}
                      {recipeData.nutrition.totalFat && (
                        <li>
                          <span>Total Fat</span>
                          <span>{recipeData.nutrition.totalFat} g</span>
                        </li>
                      )}
                      {recipeData.nutrition.saturatedFat && (
                        <li>
                          <span>Saturated Fat</span>
                          <span>{recipeData.nutrition.saturatedFat} g</span>
                        </li>
                      )}
                      {recipeData.nutrition.carbohydrates && (
                        <li>
                          <span>Total Carbohydrate</span>
                          <span>{recipeData.nutrition.carbohydrates} g</span>
                        </li>
                      )}
                      {recipeData.nutrition.sugar && (
                        <li>
                          <span>Sugars</span>
                          <span>{recipeData.nutrition.sugar} g</span>
                        </li>
                      )}
                      {recipeData.nutrition.protein && (
                        <li>
                          <span>Protein</span>
                          <span>{recipeData.nutrition.protein} g</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                <NewsletterBox />
              </div>
            </div>
            <hr className="orange hr-11"></hr>
          </div>
        </section>
      </div>
      <Footer></Footer>
    </>
  );
}

export default RecipeDetailSpoon;