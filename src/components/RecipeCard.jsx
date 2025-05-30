import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import defaultImage from '../assets/classic-lentil-soup.jpg';

function RecipeCard({ recipeName, cookTime, imageUrl, id }) {
  return (
    <Card className="h-100 shadow-sm rounded glass-card">
      <Link to={`/recipe/${id}`} className="text-decoration-none text-dark">
        <Card.Img variant="top" src={imageUrl || defaultImage} alt={recipeName} style={{ height: '180px', objectFit: 'cover' }} />
        <Card.Body className="text-center">
          <Card.Title className="h5">{recipeName}</Card.Title>
          <Card.Text className="text-muted">{cookTime}</Card.Text>
        </Card.Body>
      </Link>
    </Card>
  );
}

export default RecipeCard;