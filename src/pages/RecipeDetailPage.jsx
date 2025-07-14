import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { SPOONACULAR_API_KEY, SPOONACULAR_BASE_URL } from '../spoonacularApi';
import classicLentilSoup from '../assets/classic-lentil-soup.jpg'; // Fallback image

function RecipeDetailPage({ currentUser }) {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${SPOONACULAR_BASE_URL}/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecipeData({
          id: data.id,
          name: data.title,
          imageUrl: data.image || classicLentilSoup,
          cookTime: data.readyInMinutes ? `${data.readyInMinutes} min` : 'N/A',
          serves: data.servings ? `${data.servings} Persons` : 'N/A',
          description: data.summary ? data.summary.replace(/<\/?[^>]+(>|$)/g, "") : 'No description available.', // Remove HTML tags
          ingredients: data.extendedIngredients ? data.extendedIngredients.map(ing => ing.original) : [],
        });
      } catch (err) {
        setError(err);
        console.error("Failed to fetch recipe details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipeDetails();
    }
  }, [id]);

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
    <Container fluid className="my-4 p-4 shadow-sm rounded glass-card recipe-container">
      <Row className="text-right">
        {currentUser && <p className="text-end text-muted small">Logged in as: {currentUser.email}</p>}
      </Row>      
      <Row className="d-flex recipe-layout">
        <Col md={6} className="left-pane pe-1">
          <Image src={recipeData.imageUrl} alt={recipeData.name} fluid rounded className="mb-3 w-80 h-auto" />
          <Row className="mb-4">
            <Col>
              <div className="info-block">
                <p className="mb-1 text-muted">Cook:</p>
                <h4 className="fw-bold"><i className="far fa-clock"></i> {recipeData.cookTime}</h4>
              </div>
            </Col>
            <Col>
              <div className="info-block">
                <p className="mb-1 text-muted">Serves:</p>
                <h4 className="fw-bold"><i className="fas fa-users"></i> {recipeData.serves}</h4>
              </div>
            </Col>
          </Row>
        </Col>
        <Col md={6} className="right-pane">
          <h2 className="mb-3 text-left">{recipeData.name}</h2>
          <p className="description text-justify" dangerouslySetInnerHTML={{ __html: recipeData.description }}></p>
          <h3 className="mt-4 mb-3">Ingredients</h3>
          {recipeData.ingredients.length > 0 ? (<>
            <ul>
              {recipeData.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <Row className="mb-4">
              <div className="d-flex justify-content-evenly mt-4">
                <button type="" className="custom-button recipe">
                  Save Recipe
                </button>
                <button type="" className="custom-button recipe">
                  Print
                </button>
              </div>
            </Row>
          </>
          ) : (
            <p className="text-muted">No ingredients listed.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default RecipeDetailPage;