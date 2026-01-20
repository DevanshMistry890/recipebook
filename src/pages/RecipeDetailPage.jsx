import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Button, Spinner } from 'react-bootstrap';
import { useEdgeLLM } from '../hooks/useEdgeLLM'; // Re-imported

import NewsletterBox from '../components/NewsletterBox';
import Footer from '../components/Footer';
import '../assets/css/extra.css'; // Ensure this has blur class
import SaveRecipeButton from '../components/SaveRecipeButton.jsx';

import fallback1 from '../assets/fallbacks/fallback.webp';

const FALLBACK_IMAGE_URLS = [
  fallback1,
];

function getRandomFallbackImageUrl() {
  const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGE_URLS.length);
  return FALLBACK_IMAGE_URLS[randomIndex];
}

const BACKEND_BASE_URL = 'https://recipebkend-production.up.railway.app';

function RecipeDetailPage({ currentUser }) {
  const { id } = useParams();
  const location = useLocation();

  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lazy AI State
  const [isMissingStats, setIsMissingStats] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { init, isReady, askRecipe, response } = useEdgeLLM();

  const recipeType = 'recipe';
  const [currentDisplayImageSrc, setCurrentDisplayImageSrc] = useState(null);
  const hasFallbackAttempted = useRef(false);

  const handleDetailImageError = () => {
    if (!hasFallbackAttempted.current) {
      setCurrentDisplayImageSrc(getRandomFallbackImageUrl());
      hasFallbackAttempted.current = true;
    } else {
      console.warn(`Detail page fallback image also failed to load for recipe ID: ${id}`);
    }
  };

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const stateRecipe = location.state?.recipe;

      if (stateRecipe) {
        console.log("Using recipe data from state:", stateRecipe);
        const stats = stateRecipe.stats || {};

        // CHECK: Do we have stats?
        const hasStats = Boolean(stats.time || stats.cal);
        setIsMissingStats(!hasStats);

        setRecipeData({
          id: stateRecipe.id || stateRecipe.i,
          name: stateRecipe.name || stateRecipe.t,
          imageUrl: stateRecipe.imageUrl || stateRecipe.img,
          // Map existing or default to null
          cookTime: stats.time ? `${stats.time} min` : null,
          serves: '2-4 Persons',
          ingredients: stateRecipe.ingredients || stateRecipe.ing || [],
          instructions: stateRecipe.instructions || stateRecipe.ins || [],
          nutrition: hasStats ? {
            calories: stats.cal,
            totalFat: stats.fat,
            saturatedFat: 0,
            carbohydrates: stats.carbs,
            sugar: 0,
            protein: stats.prot
          } : null // Null nutrition triggers "Generate" view
        });

        setCurrentDisplayImageSrc(stateRecipe.imageUrl || stateRecipe.img || getRandomFallbackImageUrl());
        setLoading(false);
        return;
      }

      // Fallback Backend Fetch
      try {
        setLoading(true);
        setError(null);
        setRecipeData(null);
        hasFallbackAttempted.current = false;

        console.log(`Fetching recipe details from backend for ID: ${id}`);
        // ... (Keep existing fetch logic)
        const response = await fetch(`${BACKEND_BASE_URL}/api/recipes/${id}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Backend HTTP error! status: ${response.status}`);
        }
        const fetchedData = await response.json();

        setRecipeData({
          id: fetchedData.id,
          name: fetchedData.title,
          imageUrl: fetchedData.imageUrl,
          cookTime: fetchedData.prepTimeMinutes ? `${fetchedData.prepTimeMinutes} min` : null,
          serves: fetchedData.servings ? `${fetchedData.servings} Persons` : null,
          ingredients: fetchedData.ingredients || [],
          instructions: fetchedData.instructions || [],
          nutrition: fetchedData.nutrition?.perServing || null
        });

        setIsMissingStats(!fetchedData.nutrition?.perServing);
        setCurrentDisplayImageSrc(fetchedData.imageUrl || getRandomFallbackImageUrl());

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id, location.state]);

  // --- HANDLER: Generate AI Stats ---
  const handleGenerateAI = async () => {
    if (!isReady) {
      await init();
    }
    setIsGenerating(true);

    const raw = location.state?.recipe || recipeData;
    const llmInput = {
      t: raw.name || raw.t,
      i: (raw.ingredients || raw.ing || []).slice(0, 50)
    };

    // IMPROVED PROMPT: Ask for cleaned text as well
    const prompt = `
            Task: Estimate nutrition & Format text.
            Recipe: ${JSON.stringify(llmInput)}
            Return strictly JSON: 
            { 
              "time": number, 
              "serves": number,
              "ingredients": ["cleaned ingredient 1", "cleaned ingredient 2"],
              "instructions": ["Step 1", "Step 2"],
              "nutrition": { "calories": number, "fat": number, "carbs": number, "protein": number } 
            }
      `;

    await askRecipe(raw, prompt);
  };

  // --- EFFECT: Handle AI Response ---
  useEffect(() => {
    if (response && isGenerating) {
      try {
        const cleanJson = response.replace(/```json|```/g, '').trim();
        const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          const structured = JSON.parse(jsonMatch[0]);

          // Update State Live
          setRecipeData(prev => ({
            ...prev,
            cookTime: structured.time ? `${structured.time} min` : prev.cookTime,
            serves: structured.serves ? `${structured.serves} Persons` : prev.serves,
            // Auto-update text with formatted versions if returned
            ingredients: structured.ingredients && structured.ingredients.length > 0 ? structured.ingredients : prev.ingredients,
            instructions: structured.instructions && structured.instructions.length > 0 ? structured.instructions : prev.instructions,

            nutrition: structured.nutrition ? {
              calories: structured.nutrition.calories,
              totalFat: structured.nutrition.fat,
              saturatedFat: 0,
              carbohydrates: structured.nutrition.carbs,
              sugar: 0,
              protein: structured.nutrition.protein
            } : prev.nutrition
          }));

          if (structured.nutrition) {
            setIsGenerating(false);
            setIsMissingStats(false); // Done!
          }
        }
      } catch (e) { /* Ignore partial parse errors */ }
    }
  }, [response, isGenerating]);


  if (loading) {
    return (
      <Container className="my-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading recipe details...</span>
        </div>
        <h6>Loading Recipe Details</h6>
      </Container>
    );
  }

  if (error) return <Container className="my-5 text-center text-danger">Error: {error.message}</Container>;
  if (!recipeData) return <Container className="my-5">Recipe not found</Container>;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Recipe link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL to clipboard:', err);
      alert('Failed to copy link. Please try again.');
    }
  };

  return (
    <>
      <div className="container">
        <section className="tstbite-components my-4 my-md-5">
          {/* Header Section (Image, Title, Share) */}
          <div className="d-sm-flex">
            <div className="tstbite-svg order-sm-2 ms-auto">
              <div className="tstbite-feature pt-0">
                <a href="#" onClick={handleShare} title="Copy Recipe Link"><svg data-name="feather-icon/share" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <rect data-name="Bounding Box" width="32" height="32" fill="rgba(255,255,255,0)" />
                  <path d="M4,29.333a4,4,0,0,1-4-4V14.666a1.333,1.333,0,1,1,2.666,0V25.333A1.333,1.333,0,0,0,4,26.666H20a1.333,1.333,0,0,0,1.333-1.333V14.666a1.333,1.333,0,1,1,2.666,0V25.333a4,4,0,0,1-4,4Zm6.667-10.666V4.552L7.609,7.609A1.333,1.333,0,0,1,5.724,5.724L11.057.39a1.333,1.333,0,0,1,.307-.229h0l.025-.013.008,0,.018-.009.015-.007.011-.005.024-.011h0a1.338,1.338,0,0,1,1.062,0h0l.024.011.011,0,.016.008L12.6.143l.008,0,.025.013h0a1.333,1.333,0,0,1,.307.229l5.333,5.334a1.333,1.333,0,1,1-1.885,1.885L13.333,4.552V18.667a1.333,1.333,0,0,1-2.666,0Z" transform="translate(4 1.333)" />
                </svg></a>
              </div>
            </div>
          </div>
          <div>
            <strong>
              <svg data-name="feather-icon/trending-up" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <rect data-name="Bounding Box" width="20" height="20" fill="rgba(255,255,255,0)"></rect>
                <path d="M.244,11.423a.834.834,0,0,1,0-1.178L6.494,3.994a.834.834,0,0,1,1.178,0L11.25,7.571l5.9-5.9H14.167a.833.833,0,1,1,0-1.667h5A.833.833,0,0,1,20,.833v5a.834.834,0,0,1-1.667,0V2.845L11.839,9.339a.834.834,0,0,1-1.179,0L7.083,5.761l-5.66,5.661a.834.834,0,0,1-1.179,0Z" transform="translate(0 4.167)" fill="#ff642f"></path>
              </svg>
              <span className="ms-2 caption font-weight-medium">85% would make this again</span></strong>
            <h5 className="py-3 mb-0 h2">{recipeData.name}</h5>
          </div>

          <div className="blog-detail">
            <hr />
            <div className="rounded-12 overflow-hidden position-relative tstbite-svg">
              <img src={currentDisplayImageSrc} alt={recipeData.name} className="mb-3 w-100 img-fluid rounded" style={{ aspectRatio: '16/9', objectFit: 'cover' }} onError={handleDetailImageError} />
            </div>

            <div className="row mt-0 mt-md-5">
              <div className="col-lg-8 col-md-7">
                <div className="border-md-end pe-0 pe-lg-5">
                  <ul className="list-unstyled component-list tstbite-svg">
                    <li>
                      <small>Prep Time</small>
                      <span>{recipeData.cookTime || (isGenerating ? <Spinner size="sm" animation="border" /> : '?')}</span>
                    </li>
                    <li>
                      <small>Servings</small>
                      <span>{recipeData.serves || '?'}</span>
                    </li>
                    <li>
                      <a href="#" onClick={() => window.print()} title="Print Recipe">
                        <svg data-name="feather-icon/printer" xmlns="http://www.w3.org/2000/svg" width="20" height="22.041" viewBox="0 0 20 22.041">
                          <rect data-name="Bounding Box" width="20" height="22.041" fill="rgba(255,255,255,0)" />
                          <path d="M4.166,20.2a.88.88,0,0,1-.833-.918V16.531H2.5A2.636,2.636,0,0,1,0,13.776V9.184A2.636,2.636,0,0,1,2.5,6.429h.833V.918A.879.879,0,0,1,4.167,0h10A.878.878,0,0,1,15,.918v5.51h.833a2.636,2.636,0,0,1,2.5,2.755v4.592a2.636,2.636,0,0,1-2.5,2.755H15v2.755a.88.88,0,0,1-.834.918ZM5,18.367h8.333v-5.51H5v2.718c0,.012,0,.025,0,.038s0,.025,0,.037Zm10.834-3.673a.879.879,0,0,0,.833-.918V9.184a.878.878,0,0,0-.833-.918H2.5a.879.879,0,0,0-.833.918v4.592a.879.879,0,0,0,.833.918h.833V11.938a.88.88,0,0,1,.833-.918h10a.88.88,0,0,1,.834.918v2.756Zm-2.5-8.265V1.837H5V6.429Z" transform="translate(0.833 0.918)" />
                        </svg>
                      </a>
                    </li>
                    <SaveRecipeButton currentUser={currentUser} recipeId={recipeData.id} recipeType={recipeType} />
                  </ul>

                  {/* Ingredients & Instructions */}
                  <div className="mt-4 mt-md-5">
                    <h6>Ingredients {isGenerating && <span className="badge bg-primary ms-2"><Spinner size="md" animation="grow" /> Updating...</span>}</h6>
                    <div className="checklist pb-2">
                      {recipeData.ingredients.map((ing, i) => (
                        <div key={i} className="form-check form-check-rounded recipe-checkbox">
                          <input type="checkbox" id={`ing-${i}`} className="form-check-input" />
                          <label className="form-check-label" htmlFor={`ing-${i}`}>{ing}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 mt-md-5">
                    <h6>Instructions {isGenerating && <span className="badge bg-primary ms-2"><Spinner size="md" animation="grow" /> Updating...</span>}</h6>
                    <ul className="instruction-list list-unstyled">
                      {recipeData.instructions.map((ins, i) => <li key={i}><span>{i + 1}</span> {ins}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: Nutrition */}
              <div className="col-lg-4 col-md-5">
                {/* LAZY AI LOGIC HERE */}
                {isMissingStats && !recipeData.nutrition ? (
                  <div className="rounded-12 bg-lightest-gray p-4 text-center" style={{ position: 'relative', overflow: 'hidden' }}>
                    {/* Blurred Content Background */}
                    <div style={{ filter: 'blur(5px)', opacity: 0.5 }}>
                      <h6>Nutrition Facts</h6>
                      <ul className="Nutrition-list list-unstyled">
                        <li><span>Calories</span><span>---</span></li>
                        <li><span>Total Fat</span><span>---</span></li>
                        <li><span>Protein</span><span>---</span></li>
                      </ul>
                    </div>

                    {/* Overlay Button */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%' }}>
                      <Button variant="primary" onClick={handleGenerateAI} disabled={isGenerating}>
                        {isGenerating ? <><Spinner as="span" animation="border" size="sm" className="me-2" /> Chef AI is Analyzing...</> : "✨ Analyze with AI Chef"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  recipeData.nutrition && (
                    <div className="rounded-12 bg-lightest-gray p-4">
                      <h6>Nutrition Facts</h6>
                      <ul className="Nutrition-list list-unstyled">
                        <li><span>Calories</span><span>{recipeData.nutrition.calories} kcal</span></li>
                        <li><span>Total Fat</span><span>{recipeData.nutrition.totalFat} g</span></li>
                        <li><span>Carbohydrate</span><span>{recipeData.nutrition.carbohydrates} g</span></li>
                        <li><span>Protein</span><span>{recipeData.nutrition.protein} g</span></li>
                      </ul>
                    </div>
                  )
                )}
                <NewsletterBox />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default RecipeDetailPage;