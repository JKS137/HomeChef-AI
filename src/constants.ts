import { Recipe } from './types';

export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Avocado Toast with Poached Egg',
    image: 'https://picsum.photos/seed/avocado/600/400',
    time: '15 min',
    difficulty: 'Easy',
    category: 'Breakfast',
    ingredients: [
      { name: 'Sourdough bread', amount: '2 slices' },
      { name: 'Avocado', amount: '1 ripe' },
      { name: 'Egg', amount: '2 large' },
      { name: 'Chili flakes', amount: '1 pinch' },
      { name: 'Lemon juice', amount: '1 tsp' }
    ],
    instructions: [
      'Toast the bread until golden brown.',
      'Mash the avocado with lemon juice and salt.',
      'Poach the eggs in simmering water for 3-4 minutes.',
      'Spread avocado on toast, top with eggs and chili flakes.'
    ],
    calories: '450 kcal'
  },
  {
    id: '2',
    title: 'Creamy Mushroom Pasta',
    image: 'https://picsum.photos/seed/pasta/600/400',
    time: '25 min',
    difficulty: 'Medium',
    category: 'Lunch',
    ingredients: [
      { name: 'Pasta', amount: '200g' },
      { name: 'Mushrooms', amount: '250g' },
      { name: 'Heavy cream', amount: '100ml' },
      { name: 'Garlic', amount: '2 cloves' },
      { name: 'Parmesan', amount: '50g' }
    ],
    instructions: [
      'Cook pasta according to package instructions.',
      'Sauté mushrooms and garlic until browned.',
      'Add cream and simmer for 5 minutes.',
      'Toss pasta in sauce and top with parmesan.'
    ],
    calories: '650 kcal'
  },
  {
    id: '3',
    title: 'Grilled Salmon with Asparagus',
    image: 'https://picsum.photos/seed/salmon/600/400',
    time: '30 min',
    difficulty: 'Hard',
    category: 'Dinner',
    ingredients: [
      { name: 'Salmon fillet', amount: '2' },
      { name: 'Asparagus', amount: '1 bunch' },
      { name: 'Olive oil', amount: '2 tbsp' },
      { name: 'Lemon', amount: '1 half' },
      { name: 'Thyme', amount: '2 sprigs' }
    ],
    instructions: [
      'Season salmon with salt, pepper, and olive oil.',
      'Grill salmon for 4-5 minutes per side.',
      'Sauté asparagus with lemon juice.',
      'Serve salmon hot with asparagus.'
    ],
    calories: '550 kcal'
  },
  {
    id: '4',
    title: 'Classic Chocolate Lava Cake',
    image: 'https://picsum.photos/seed/cake/600/400',
    time: '20 min',
    difficulty: 'Medium',
    category: 'Desserts',
    ingredients: [
      { name: 'Dark chocolate', amount: '100g' },
      { name: 'Butter', amount: '50g' },
      { name: 'Eggs', amount: '2' },
      { name: 'Sugar', amount: '50g' },
      { name: 'Flour', amount: '2 tbsp' }
    ],
    instructions: [
      'Melt chocolate and butter together.',
      'Whisk eggs and sugar until pale.',
      'Fold in chocolate and flour.',
      'Bake at 200°C for 10-12 minutes until edges are set.'
    ],
    calories: '350 kcal'
  }
];

export const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Desserts'] as const;

export const ONBOARDING_SLIDES = [
  {
    id: 1,
    title: 'Find Recipes from Your Ingredients',
    description: 'Tell us what you have in your fridge, and we will find the perfect meal for you.',
    image: 'https://picsum.photos/seed/cooking1/400/400'
  },
  {
    id: 2,
    title: 'AI Cooking Assistant Anytime',
    description: 'Get step-by-step guidance and smart substitutions from our AI Chef.',
    image: 'https://picsum.photos/seed/cooking2/400/400'
  },
  {
    id: 3,
    title: 'Smart Grocery Lists Made Easy',
    description: 'Auto-generate shopping lists for missing ingredients and share them instantly.',
    image: 'https://picsum.photos/seed/grocery/400/400'
  }
];
