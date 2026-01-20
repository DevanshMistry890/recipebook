import React, { useState, useEffect, useRef } from 'react';
// We removed Link because we are using the parent's onClick for navigation now

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

function RecipeCard({ recipe, onClick }) {
  // Destructure the new data fields
  const { id, name, cookTime, imageUrl, ingredients } = recipe;

  // --- OLD CODE: Fallback Logic ---
  const [currentImageSrc, setCurrentImageSrc] = useState(imageUrl || getRandomFallbackImageUrl());
  const hasFallbackAttempted = useRef(false);

  useEffect(() => {
    setCurrentImageSrc(imageUrl || getRandomFallbackImageUrl());
    hasFallbackAttempted.current = false;
  }, [imageUrl, id]);

  const handleImageError = () => {
    if (!hasFallbackAttempted.current) {
      setCurrentImageSrc(getRandomFallbackImageUrl());
      hasFallbackAttempted.current = true;
    } else {
      console.warn(`Fallback image also failed for recipe: ${name} (ID: ${id})`);
    }
  };

  // --- OLD CODE: Layout (figure/figcaption) ---
  return (
    <figure className="my-3 my-md-4 tstbite-card">
      <a
        onClick={onClick}
        className="tstbite-animation stretched-link rounded-6 d-block"
        style={{ cursor: 'pointer' }}
      >
        <img
          src={currentImageSrc}
          alt={name}
          onError={handleImageError}
          className="w-100"
          style={{ height: '180px', objectFit: 'cover' }}
        />
      </a>

      <figcaption className="mt-2 text-center">
        <a
          onClick={onClick}
          className="text-black d-block mt-1 font-weight-semibold big"
          style={{ cursor: 'pointer' }}
        >
          {name}
        </a>

        {cookTime && <span className="badge bg-success bg-opacity-75 me-2">{cookTime}</span>}

        {/* --- NEW DATA: Ingredients (fitted into old layout) --- */}
        <div className="text-muted small mt-1" style={{ fontSize: '0.85em' }}>
          {Array.isArray(ingredients)
            ? ingredients.slice(0, 3).join(', ') + (ingredients.length > 3 ? '...' : '')
            : ''}
        </div>

      </figcaption>
    </figure>
  );
}

export default RecipeCard;