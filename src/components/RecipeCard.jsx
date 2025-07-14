import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';


import fallback1 from '../assets/fallbacks/fallback.webp';
import fallback2 from '../assets/fallbacks/fallback2.webp';
import fallback3 from '../assets/fallbacks/fallback3.webp';
import fallback4 from '../assets/fallbacks/fallback4.webp';
import fallback5 from '../assets/fallbacks/fallback5.jpg';

const FALLBACK_IMAGE_URLS = [
  fallback1,
  fallback2,
  fallback3,
  fallback4,
  fallback5
];

function getRandomFallbackImageUrl() {
  const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGE_URLS.length);
  return FALLBACK_IMAGE_URLS[randomIndex];
}

function RecipeCard({ recipeName, cookTime, imageUrl, id }) {
  const [currentImageSrc, setCurrentImageSrc] = useState(imageUrl || getRandomFallbackImageUrl());
  const hasFallbackAttempted = useRef(false);
  useEffect(() => {
    setCurrentImageSrc(imageUrl || getRandomFallbackImageUrl());
    hasFallbackAttempted.current = false; // Reset for a new image prop
  }, [imageUrl, id]);

  const handleImageError = () => {
    // Only attempt to set a fallback if we haven't tried one already for this image
    if (!hasFallbackAttempted.current) {
      setCurrentImageSrc(getRandomFallbackImageUrl()); // Set a new random fallback
      hasFallbackAttempted.current = true;
    } else {
      console.warn(`Fallback image also failed to load for recipe: ${recipeName} (ID: ${id})`);
    }
  };


  return (
    <figure className="my-3 my-md-4 tstbite-card">
      <Link to={`/recipe/${id}`} className="tstbite-animation stretched-link rounded-6 d-block">
        <img
          src={currentImageSrc}
          alt={recipeName}
          onError={handleImageError}
          className="w-100"
          style={{ height: '180px', objectFit: 'cover' }}
        />
      </Link>
      <figcaption className="mt-2 text-center">
        <Link to={`/recipe/${id}`} className="text-black d-block mt-1 font-weight-semibold big">
          {recipeName}
        </Link>
        {cookTime && <span className="text-muted small d-block">{cookTime}</span>}
      </figcaption>
    </figure>
  );
}

export default RecipeCard;