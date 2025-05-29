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
    <Container className="my-4 p-4 shadow-sm rounded glass-card ">
      {currentUser && <p className="text-end text-muted small">Logged in as: {currentUser.email}</p>}
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <Image src={recipeData.imageUrl} alt={recipeData.name} fluid rounded />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={6} className="text-center">
          <p className="mb-0 text-muted">Cook:</p>
          <h4 className="fw-bold">{recipeData.cookTime}</h4>
        </Col>
        <Col xs={6} className="text-center">
          <p className="mb-0 text-muted">Serves:</p>
          <h4 className="fw-bold">{recipeData.serves}</h4>
        </Col>
      </Row>
      <h2 className="mb-3 text-center">{recipeData.name}</h2>
      <p className="description text-justify" dangerouslySetInnerHTML={{ __html: recipeData.description }}></p>

      <h3 className="mt-4 mb-3">Ingredients</h3>
      {recipeData.ingredients.length > 0 ? (
        <ul>
          {recipeData.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No ingredients listed.</p>
      )}
    </Container>
  );
}

export default RecipeDetailPage;