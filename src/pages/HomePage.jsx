import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import RecipeCardList from '../components/RecipeCardList';
import RecipeCardListSpoon from '../components/RecipeCardListSpoon';
import RecipeCardListSpoon2 from '../components/RecipeCardListSpoon2';
import HeroBanner from '../components/HeroBanner';
import Categories from '../components/Categories';
import NewsletterSignup from '../components/NewsletterSignup';
import Footer from '../components/Footer';
import { SPOONACULAR_API_KEY, SPOONACULAR_BASE_URL } from '../spoonacularApi';
import classicLentilSoup from '../assets/classic-lentil-soup.jpg';

function HomePage({ currentUser }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${SPOONACULAR_BASE_URL}/recipes/random?number=8&apiKey=${SPOONACULAR_API_KEY}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedRecipes = data.recipes.map(recipe => ({
          id: recipe.id,
          name: recipe.title,
          cookTime: recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : 'N/A',
          imageUrl: recipe.image || classicLentilSoup, // Fallback to local image
        }));
        setRecipes(formattedRecipes);
      } catch (err) {
        setError(err);
        console.error("Failed to fetch recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomRecipes();
  }, []);

  if (loading) {
    return (
        <Container className="my-4 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading recipes...</span>
            </div>
        </Container>
    );
  }

  if (error) {
    return <Container className="my-4 text-center text-danger">Error: {error.message}</Container>;
  }

  return (
    <section className="tstbite-section p-0">
    <Container>
      {currentUser && <p className="ms-3 text-muted">Welcome, {currentUser.email.split('@')[0]} !</p>}
      <HeroBanner />

      <section className="tstbite-components my-4 my-md-5">
      <h5 className="py-3 mb-0">Super Delicious</h5>
        { <RecipeCardListSpoon2 recipes={recipes} /> }
      </section>     

      <Categories />
    </Container>
    <NewsletterSignup></NewsletterSignup>
    <Container>
      <section className="tstbite-components my-4 my-md-5">
      <h5 className="py-3 mb-0">Latest Recipes</h5>
      { <RecipeCardListSpoon recipes={recipes} /> }
      </section>
    </Container>
    <Footer></Footer>
    </section>
  );
}

export default HomePage;