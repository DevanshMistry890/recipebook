import React from 'react';
import { Row, Col } from 'react-bootstrap';
import RecipeCard from './RecipeCardSpoon';

function RecipeCardListSpoon({ recipes }) {
  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {recipes.map((recipe) => (
        <Col key={recipe.id}>
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