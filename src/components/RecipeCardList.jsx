import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import RecipeCard from './RecipeCard';

function RecipeCardList({ recipes }) {
  const navigate = useNavigate();

  // The NEW data flow: Handle click here to pass state
  const handleCardClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`, {
      state: { recipe: recipe }
    });
  };

  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {recipes.map((recipe) => (
        <Col key={recipe.id}>
          {/* Pass the full object and the click handler */}
          <RecipeCard
            recipe={recipe}
            onClick={() => handleCardClick(recipe)}
          />
        </Col>
      ))}
    </Row>
  );
}

export default RecipeCardList;