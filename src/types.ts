export interface Recipe {
  id: string;
  title: string;
  image: string;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: { name: string; amount: string }[];
  instructions: string[];
  calories?: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Desserts';
  matchScore?: number;
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: string;
  checked: boolean;
}

export type Screen = 
  | 'splash' 
  | 'onboarding' 
  | 'home' 
  | 'ingredients' 
  | 'recipe-list' 
  | 'recipe-detail' 
  | 'chat' 
  | 'cooking-mode' 
  | 'grocery' 
  | 'profile';

export interface AppState {
  currentScreen: Screen;
  onboardingStep: number;
  selectedIngredients: string[];
  favorites: string[]; // Recipe IDs
  groceryList: GroceryItem[];
  currentRecipeId: string | null;
  currentStepIndex: number;
}
