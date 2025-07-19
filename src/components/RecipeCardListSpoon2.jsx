import React from 'react';
import { Row, Col } from 'react-bootstrap';
import RecipeCard from './RecipeCardSpoon';

function RecipeCardListSpoon({ recipes }) {
  return (
    <Row className="g-4">
      {recipes.sort(() => 0.5 - Math.random()).slice(0, 3).map((recipe) => (
        <Col key={recipe.id} md={4}>
          <RecipeCard
            id={recipe.id}
            recipeName={recipe.name}
            cookTime={recipe.cookTime}
            imageUrl={recipe.imageUrl}
          />
        </Col>
      ))}
    </Row>
  );
}

export default RecipeCardListSpoon;