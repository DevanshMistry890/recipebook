import React from 'react';

// Import images (adjust paths as needed)
import pastaImg from '../assets/images/menus/menu8.png';
import pizzaImg from '../assets/images/menus/menu9.png';
import veganImg from '../assets/images/menus/menu10.png';
import dessertsImg from '../assets/images/menus/menu11.png';
import smoothiesImg from '../assets/images/menus/menu12.png';
import breakfastImg from '../assets/images/menus/menu13.png';

const categories = [
  { title: 'Pasta', image: pastaImg },
  { title: 'Pizza', image: pizzaImg },
  { title: 'Vegan', image: veganImg },
  { title: 'Desserts', image: dessertsImg },
  { title: 'Smoothies', image: smoothiesImg },
  { title: 'Breakfast', image: breakfastImg },
];

function Categories() {
  return (
    <section className="tstbite-components my-4 my-md-5">
      <h5 className="py-3 mb-0">Popular Categories</h5>
      <div className="row">
        {categories.map((cat, index) => (
          <div key={index} className="col-lg-2 col-md-4 col-4">
            <figure className="my-3 text-center tstbite-card">
              <a href="#" className="tstbite-animation stretched-link rounded-circle">
                <img src={cat.image} className="rounded-circle w-100" alt={cat.title} />
              </a>
              <figcaption className="mt-2">
                <a href="#" className="tstbite-category-title">{cat.title}</a>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;
