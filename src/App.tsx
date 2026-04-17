import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat, 
  Search, 
  Heart, 
  MessageSquare, 
  ShoppingCart, 
  User, 
  Plus, 
  X, 
  ArrowRight, 
  ChevronLeft, 
  Clock, 
  Star, 
  Share2, 
  CheckCircle2, 
  Circle,
  Play,
  RotateCcw,
  Send,
  MoreVertical,
  Settings,
  LogOut,
  Sparkles,
  Mic,
  MicOff,
  Trash2,
  Pause,
  Timer,
  SlidersHorizontal
} from 'lucide-react';
import { Button, Card, Input, Badge, cn } from './components/UI';
import { Recipe, GroceryItem, Screen, AppState } from './types';
import { MOCK_RECIPES, CATEGORIES, ONBOARDING_SLIDES } from './constants';
import * as ai from './services/gemini';
import Markdown from 'react-markdown';

export default function App() {
  const [state, setState] = useState<AppState>({
    currentScreen: 'splash',
    onboardingStep: 0,
    selectedIngredients: [],
    favorites: [],
    groceryList: [],
    currentRecipeId: null,
    currentStepIndex: 0
  });

  const [aiRecipes, setAiRecipes] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [filters, setFilters] = useState({
    maxTime: 60,
    difficulty: 'All',
    sortBy: 'match' as 'match' | 'time' | 'difficulty'
  });

  // Splash Screen timer
  useEffect(() => {
    if (state.currentScreen === 'splash') {
      const timer = setTimeout(() => {
        const hasFinishedOnboarding = localStorage.getItem('onboardingDone');
        setState(prev => ({ 
          ...prev, 
          currentScreen: hasFinishedOnboarding ? 'home' : 'onboarding' 
        }));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state.currentScreen]);

  const navigate = (screen: Screen, extras = {}) => {
    setState(prev => ({ ...prev, currentScreen: screen, ...extras }));
    window.scrollTo(0, 0);
  };

  const currentRecipe = MOCK_RECIPES.find(r => r.id === state.currentRecipeId);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.includes(id) 
        ? prev.favorites.filter(fid => fid !== id) 
        : [...prev.favorites, id]
    }));
  };

  const addIngredient = (ingredient: string) => {
    if (!ingredient.trim()) return;
    if (state.selectedIngredients.includes(ingredient)) return;
    setState(prev => ({
      ...prev,
      selectedIngredients: [...prev.selectedIngredients, ingredient]
    }));
  };

  const removeIngredient = (ingredient: string) => {
    setState(prev => ({
      ...prev,
      selectedIngredients: prev.selectedIngredients.filter(i => i !== ingredient)
    }));
  };

  const handleSearch = async () => {
    setIsAiLoading(true);
    navigate('recipe-list');
    try {
      const suggestions = await ai.getRecipeSuggestions(state.selectedIngredients);
      setAiRecipes(suggestions);
    } catch (error) {
      console.error(error);
      setAiRecipes([]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const addToGroceryList = (ingredients: { name: string; amount: string }[]) => {
    const newItems: GroceryItem[] = ingredients.map(ing => ({
      id: Math.random().toString(36).substr(2, 9),
      name: ing.name,
      amount: ing.amount,
      checked: false
    }));
    setState(prev => ({
      ...prev,
      groceryList: [...prev.groceryList, ...newItems]
    }));
    alert(`${ingredients.length} items added to your grocery list!`);
  };

  const toggleGroceryItem = (id: string) => {
    setState(prev => ({
      ...prev,
      groceryList: prev.groceryList.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  // Screen Components
  const SplashScreen = () => (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-primary overflow-hidden relative">
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-32 h-32 bg-white rounded-[40px] flex items-center justify-center shadow-2xl relative z-10"
      >
        <ChefHat className="w-16 h-16 text-primary" strokeWidth={2.5} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <h1 className="text-4xl font-bold text-white font-display italic">HomeChef</h1>
        <p className="text-white/70 mt-2 font-medium tracking-wide font-sans">AI Recipe Assistant</p>
      </motion.div>

      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-4 gap-8 rotate-12 scale-150">
          {Array.from({ length: 16 }).map((_, i) => (
            <ChefHat key={i} className="w-20 h-20 text-white" />
          ))}
        </div>
      </div>
    </div>
  );

  const Onboarding = () => {
    const slide = ONBOARDING_SLIDES[state.onboardingStep];
    const isLastSlide = state.onboardingStep === ONBOARDING_SLIDES.length - 1;

    return (
      <div className="h-screen bg-warm-bg flex flex-col px-8 pt-20 pb-12">
        <div className="flex-1 flex flex-col items-center text-center space-y-12">
          <motion.div 
            key={slide.title}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="w-full flex flex-col items-center space-y-8"
          >
            <div className={`w-64 h-64 bg-primary rounded-[60px] flex items-center justify-center shadow-deep text-white`}>
              <ChefHat className="w-32 h-32" />
            </div>
            <div className="space-y-4 px-4">
              <h2 className="text-4xl font-bold italic">{slide.title}</h2>
              <p className="text-text-light text-lg leading-relaxed">{slide.description}</p>
            </div>
          </motion.div>
        </div>

        <div className="space-y-8 pt-10">
          <div className="flex justify-center gap-2">
            {ONBOARDING_SLIDES.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${i === state.onboardingStep ? 'w-8 bg-primary' : 'w-2 bg-primary/20'}`} 
              />
            ))}
          </div>
          <Button 
            className="w-full h-16 rounded-[24px] text-lg font-bold"
            onClick={() => {
              if (isLastSlide) {
                localStorage.setItem('onboardingDone', 'true');
                navigate('home');
              } else {
                setState(prev => ({ ...prev, onboardingStep: prev.onboardingStep + 1 }));
              }
            }}
          >
            {isLastSlide ? 'Get Cooking!' : 'Continue'}
          </Button>
          {!isLastSlide && (
            <button 
              onClick={() => navigate('home')}
              className="w-full text-text-light/50 font-bold uppercase tracking-widest text-xs"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    return (
      <div className="min-h-screen pb-40 px-6 pt-12 space-y-10 max-w-2xl mx-auto">
        <header className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold italic">Hello, Chef! 👨‍🍳</h2>
            <p className="text-text-light font-medium italic">What's on the menu today?</p>
          </div>
          <motion.div whileHover={{ scale: 1.1 }} onClick={() => navigate('profile')} className="w-14 h-14 rounded-2xl bg-white shadow-deep border border-black/5 overflow-hidden flex items-center justify-center cursor-pointer">
            <User className="w-6 h-6 text-primary" />
          </motion.div>
        </header>

        <section className="relative">
          <Input 
            readOnly 
            placeholder="Search recipes, ingredients..." 
            className="h-16 pl-14 cursor-pointer rounded-[24px]"
            onClick={() => navigate('ingredients')}
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light/40" />
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xl font-bold italic">Explore Categories</h3>
            <button className="text-[10px] font-bold text-secondary uppercase tracking-[2px]">View All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                className="flex-shrink-0 flex flex-col items-center gap-3 p-4 bg-white rounded-[32px] border border-black/5 shadow-soft min-w-[100px] hover:border-primary/30 transition-all"
              >
                <div className="text-2xl">🍴</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/60">{cat}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center px-1">
             <h3 className="text-xl font-bold italic">Top Picks for You</h3>
             <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
          </div>
          <div className="grid gap-6">
            {MOCK_RECIPES.slice(0, 2).map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>

        <section className="bg-primary p-8 rounded-[40px] text-white relative overflow-hidden shadow-deep">
          <div className="space-y-2 relative z-10">
            <h4 className="text-xl font-bold italic">Cooking Tip of the Day</h4>
            <p className="text-white/80 leading-relaxed font-medium">To keep hard-boiled eggs from cracking, add a pinch of salt to the water! 🧂</p>
          </div>
          <ChefHat className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10" />
        </section>
      </div>
    );
  };

  const IngredientInput = () => {
    const [inputValue, setInputValue] = useState('');

    return (
      <div className="min-h-screen pb-24 px-8 pt-12 max-w-2xl mx-auto flex flex-col">
        <header className="flex items-center gap-4 mb-10">
          <Button variant="ghost" size="icon" onClick={() => navigate('home')}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold italic">Your Pantry</h1>
        </header>

        <div className="space-y-4">
          <div className="relative">
            <Input 
              placeholder="Search or add ingredient..." 
              className="h-16 pr-16 bg-[#f5f2ed]"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addIngredient(inputValue);
                  setInputValue('');
                }
              }}
            />
            <Button 
              size="icon" 
              className="absolute right-2 top-2 h-12 w-12 rounded-xl"
              onClick={() => {
                addIngredient(inputValue);
                setInputValue('');
              }}
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {state.selectedIngredients.map(ing => (
              <motion.div
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={ing}
                className="bg-accent text-white pl-4 pr-1 py-1 text-sm font-medium rounded-full flex items-center gap-2 group shadow-soft"
              >
                {ing}
                <button 
                  onClick={() => removeIngredient(ing)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
            {state.selectedIngredients.length === 0 && (
              <p className="text-charcoal/30 text-sm italic py-4">No ingredients added yet...</p>
            )}
          </div>
        </div>

        <section className="space-y-4 mt-12">
          <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal/40">Suggested for you</h3>
          <div className="flex flex-wrap gap-2">
            {['Potatoes', 'Pasta', 'Cheese', 'Onion', 'Garlic', 'Tomato', 'Chicken', 'Eggs'].map(item => (
              <button
                key={item}
                onClick={() => addIngredient(item)}
                className="px-4 py-2 bg-white border border-black/5 rounded-2xl text-sm font-medium hover:border-primary/40 hover:text-primary transition-all shadow-soft"
              >
                + {item}
              </button>
            ))}
          </div>
        </section>

        <div className="flex-1" />

        <Button 
          disabled={state.selectedIngredients.length === 0}
          onClick={handleSearch}
          className="w-full h-16 text-lg rounded-[24px]"
        >
          Find Recipes <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    );
  };

  const RecipeList = () => {
    const [showFilters, setShowFilters] = useState(false);

    const filteredAndSortedRecipes = [...MOCK_RECIPES]
      .filter(r => {
        const timeValue = parseInt(r.time);
        const timeMatch = timeValue <= filters.maxTime;
        const difficultyMatch = filters.difficulty === 'All' || r.difficulty === filters.difficulty;
        return timeMatch && difficultyMatch;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'time') return parseInt(a.time) - parseInt(b.time);
        if (filters.sortBy === 'difficulty') {
          const levels: Record<string, number> = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return levels[a.difficulty] - levels[b.difficulty];
        }
        return 0; // Default match (mock order)
      });

    return (
      <div className="min-h-screen pb-24 px-4 pt-12 max-w-2xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('ingredients')}>
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold italic">Recipe Ideas</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn("rounded-xl border-primary/20", showFilters && "bg-primary text-white border-primary")}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </header>

        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-white border-2 border-primary/5 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-charcoal/40">
                  <span>Max Cooking Time</span>
                  <span className="text-primary">{filters.maxTime} min</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="60" 
                  step="5"
                  value={filters.maxTime}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxTime: parseInt(e.target.value) }))}
                  className="w-full accent-primary h-1.5 bg-black/5 rounded-full appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">Difficulty</span>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Easy', 'Medium', 'Hard'].map(level => (
                      <button
                        key={level}
                        onClick={() => setFilters(prev => ({ ...prev, difficulty: level }))}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                          filters.difficulty === level 
                            ? "bg-primary text-white border-primary" 
                            : "bg-white text-charcoal/40 border-black/5 hover:border-primary/20"
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">Sort By</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'match', label: 'Match' },
                      { id: 'time', label: 'Time' },
                      { id: 'difficulty', label: 'Level' }
                    ].map(sort => (
                      <button
                        key={sort.id}
                        onClick={() => setFilters(prev => ({ ...prev, sortBy: sort.id as any }))}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                          filters.sortBy === sort.id 
                            ? "bg-secondary text-white border-secondary" 
                            : "bg-white text-charcoal/40 border-black/5 hover:border-secondary/20"
                        )}
                      >
                        {sort.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {isAiLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-6">
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full"
            />
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold italic font-display">Crafting your menu...</h2>
              <p className="text-charcoal/60">AI is analyzing your ingredients</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="space-y-6">
              <div className="flex justify-between items-end">
                <h2 className="text-xl font-bold italic">AI Recommended</h2>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-[2px]">3 Creative Ideas 🥗</span>
              </div>
              
              <div className="grid gap-6">
                {aiRecipes.map((recipe, idx) => (
                  <Card key={idx} className="p-6 bg-white border-2 border-primary/5 hover:border-primary/20 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3">
                      <Sparkles className="w-5 h-5 text-secondary/30" />
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{recipe.title}</h3>
                        <p className="text-text-light text-sm italic font-medium leading-relaxed">
                          "{recipe.reason}"
                        </p>
                      </div>

                      <div className="pt-4 border-t border-black/5">
                        <div className="flex flex-col gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">Missing for completion:</span>
                          <div className="flex flex-wrap gap-2">
                            {recipe.missingIngredients?.split(',').map((m: string) => (
                              <span key={m} className="px-3 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full text-[10px] font-bold uppercase whitespace-nowrap">
                                {m.trim()}
                              </span>
                            ))}
                            {(!recipe.missingIngredients || recipe.missingIngredients === 'none') && (
                              <span className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Fully Matched!
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <div className="p-3 bg-warm-bg rounded-xl border border-black/5 flex items-start gap-3">
                          <div className="w-6 h-6 shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                            <ChefHat className="w-3 h-3 text-primary" />
                          </div>
                          <p className="text-[11px] text-charcoal/60 leading-tight">
                            <span className="font-bold text-primary">Chef's Tip:</span> {recipe.tip || "Try adding a splash of lemon juice for brightness."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <h3 className="text-lg font-bold mt-12 pb-2 border-b border-black/5 flex items-center justify-between">
              Matches from Database
              <span className="text-xs font-medium text-charcoal/30">{filteredAndSortedRecipes.length} results</span>
            </h3>
            <div className="grid gap-6">
              {filteredAndSortedRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
              {filteredAndSortedRecipes.length === 0 && (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8 text-charcoal/20" />
                  </div>
                  <p className="text-charcoal/40 italic">No recipes match your current filters.</p>
                  <Button variant="ghost" className="text-primary font-bold" onClick={() => setFilters({ maxTime: 60, difficulty: 'All', sortBy: 'match' })}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const RecipeDetail = () => {
    if (!currentRecipe) return null;

    return (
      <div className="min-h-screen bg-white">
        <div className="relative h-[45vh]">
          <img 
            src={currentRecipe.image} 
            alt={currentRecipe.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute top-12 left-6 right-6 flex justify-between">
            <button 
              onClick={() => navigate('home')}
              className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-charcoal"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => toggleFavorite(currentRecipe.id)}
              className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-charcoal"
            >
              <Heart className={cn("w-6 h-6", state.favorites.includes(currentRecipe.id) && "fill-primary text-primary")} />
            </button>
          </div>

          <div className="absolute bottom-10 left-8 right-8 text-white space-y-4">
            <Badge variant="accent">{currentRecipe.category}</Badge>
            <h1 className="text-4xl font-bold leading-tight">{currentRecipe.title}</h1>
            <div className="flex gap-6 opacity-80 font-medium">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {currentRecipe.time}</span>
              <span className="flex items-center gap-2"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {currentRecipe.difficulty}</span>
              <span className="flex items-center gap-2"><Play className="w-4 h-4" /> {currentRecipe.calories}</span>
            </div>
          </div>
        </div>

        <div className="relative -mt-8 bg-warm-bg rounded-t-[40px] p-8 space-y-10 min-h-[60vh] pb-32">
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold italic">Ingredients</h2>
              <button 
                onClick={() => addToGroceryList(currentRecipe.ingredients)}
                className="text-primary font-bold text-sm flex items-center gap-2 border-2 border-primary/20 px-4 py-2 rounded-xl"
              >
                <Plus className="w-4 h-4" /> Add all to list
              </button>
            </div>
            <div className="grid gap-3">
              {currentRecipe.ingredients.map(ing => (
                 <div key={ing.name} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-soft border border-black/5">
                    <div className="flex items-center gap-4">
                      <Circle className="w-5 h-5 text-primary/20" />
                      <span className="font-medium">{ing.name}</span>
                    </div>
                    <span className="text-xs font-bold text-charcoal/40 uppercase tracking-widest">{ing.amount}</span>
                 </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold italic">Instructions</h2>
            <div className="space-y-8 relative">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-black/5" />
              {currentRecipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-6 relative">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 z-10 font-bold shadow-lg shadow-primary/20">
                    {i + 1}
                  </div>
                  <p className="text-charcoal/70 leading-relaxed pt-1 text-lg">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <Button 
            className="w-full h-20 text-xl rounded-[30px] shadow-primary shadow-2xl"
            onClick={() => navigate('cooking-mode', { currentStepIndex: 0 })}
          >
            Start Cooking Mode
          </Button>
        </div>
      </div>
    );
  };

  const CookingMode = () => {
    if (!currentRecipe) return null;
    const step = currentRecipe.instructions[state.currentStepIndex];
    const isLast = state.currentStepIndex === currentRecipe.instructions.length - 1;

    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isActive, setIsActive] = useState(false);

    // Parse time from step text (e.g., "5 minutes", "10 min", "30 seconds")
    useEffect(() => {
      const timeMatch = step.match(/(\d+)\s*(minute|min|second|sec)/i);
      if (timeMatch) {
        let seconds = parseInt(timeMatch[1]);
        if (timeMatch[2].toLowerCase().startsWith('min')) {
          seconds *= 60;
        }
        setTimeLeft(seconds);
        setIsActive(false);
      } else {
        setTimeLeft(null);
        setIsActive(false);
      }
    }, [state.currentStepIndex, step]);

    useEffect(() => {
      let interval: any = null;
      if (isActive && timeLeft && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft(prev => (prev && prev > 0 ? prev - 1 : 0));
        }, 1000);
      } else if (timeLeft === 0) {
        setIsActive(false);
      }
      return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="min-h-screen bg-warm-bg flex flex-col p-8">
        <header className="flex justify-between items-center mb-12">
          <Button variant="ghost" size="icon" onClick={() => navigate('recipe-detail')}>
             <X className="w-8 h-8" />
          </Button>
          <div className="text-center font-display italic">
             <span className="text-primary font-bold text-lg">Step {state.currentStepIndex + 1}</span>
             <span className="text-charcoal/30 block text-sm italic">of {currentRecipe.instructions.length}</span>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-6 h-6" />
          </Button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center text-center gap-12 max-w-lg mx-auto">
          <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((state.currentStepIndex + 1) / currentRecipe.instructions.length) * 100}%` }}
              className="h-full bg-primary"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentStepIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <p className="text-3xl font-bold leading-tight font-display tracking-tight text-charcoal">
                {step}
              </p>

              {timeLeft !== null && (
                <div className="flex flex-col items-center gap-6">
                  <div className={cn(
                    "relative w-48 h-48 rounded-full border-8 flex flex-col items-center justify-center transition-all shadow-deep transition-all duration-500",
                    isActive ? "border-secondary/20 bg-secondary/5" : "border-primary/10 bg-white"
                  )}>
                    <div className="absolute top-6">
                      <Timer className={cn("w-5 h-5", isActive ? "text-secondary animate-pulse" : "text-charcoal/20")} />
                    </div>
                    <span className={cn(
                      "text-5xl font-bold font-display lining-nums",
                      timeLeft === 0 ? "text-red-500 scale-110" : "text-charcoal",
                      isActive && "animate-pulse"
                    )}>
                      {formatTime(timeLeft)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/30 mt-1">
                      {timeLeft === 0 ? "Time's up!" : isActive ? "Ticking..." : "Paused"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full w-14 h-14 border-primary/20 bg-white"
                      onClick={() => {
                        const timeMatch = step.match(/(\d+)\s*(minute|min|second|sec)/i);
                        if (timeMatch) {
                          let seconds = parseInt(timeMatch[1]);
                          if (timeMatch[2].toLowerCase().startsWith('min')) seconds *= 60;
                          setTimeLeft(seconds);
                        } else {
                          setTimeLeft(60);
                        }
                        setIsActive(false);
                      }}
                    >
                      <RotateCcw className="w-6 h-6" />
                    </Button>

                    <Button 
                      size="icon" 
                      className={cn(
                        "rounded-full w-20 h-20 shadow-2xl transition-all",
                        isActive ? "bg-red-500 hover:bg-red-600 shadow-red-200" : "bg-secondary hover:bg-secondary/90 shadow-secondary/20"
                      )}
                      onClick={() => setIsActive(!isActive)}
                    >
                      {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full w-14 h-14 text-charcoal/20"
                      disabled
                    >
                      <span className="text-xl font-bold">+</span>
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          <img 
            src={currentRecipe.image} 
            className="w-full aspect-video rounded-[40px] object-cover grayscale opacity-20 blur-xl -z-10 absolute inset-x-8 bottom-48"
            alt="background"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex flex-col gap-6 pt-12 pb-8">
          <div className="flex gap-4">
            <Button 
              disabled={state.currentStepIndex === 0}
              variant="outline" 
              className="flex-1 h-16 rounded-[24px]"
              onClick={() => setState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex - 1 }))}
            >
              Previous
            </Button>
            <Button 
              className="flex-[2] h-16 rounded-[24px]"
              onClick={() => {
                if (isLast) navigate('home');
                else setState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex + 1 }));
              }}
            >
              {isLast ? 'Done!' : 'Next Step'}
            </Button>
          </div>
          <button 
            onClick={() => navigate('chat')}
            className="flex items-center justify-center gap-2 text-charcoal/50 font-bold hover:text-primary transition-colors text-lg"
          >
            <MessageSquare className="w-6 h-6" /> Ask Chef AI for help
          </button>
        </div>
      </div>
    );
  };

  const ChatBot = () => {
    const [msgs, setMsgs] = useState([
      { role: 'assistant', text: "Hey there! I'm your HomeChef assistant. Ask me anything about cooking, substitutions, or nutrition! 👩‍🍳" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [msgs, isTyping]);

    useEffect(() => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
        };
        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
        recognitionRef.current = recognition;
      }
    }, []);

    const toggleListening = () => {
      if (!recognitionRef.current) {
        alert("Speech recognition is not supported in this browser.");
        return;
      }
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    };

    const handleSend = async () => {
      if (!input.trim()) return;
      const userMsg = input;
      setInput('');
      setMsgs(prev => [...prev, { role: 'user', text: userMsg }]);
      setIsTyping(true);
      
      const subRegex = /(?:substitute|replace|instead\s+of|alternative\s+for)\s+([\w\s]+)/i;
      const subMatch = userMsg.match(subRegex);
      
      if (subMatch && subMatch[1]) {
        const ingredient = subMatch[1].trim();
        try {
          const substitutes = await ai.getIngredientSubstitutes(ingredient);
          let responseText = `### Substitutes for **${ingredient}**:\n\n`;
          if (substitutes && substitutes.length > 0) {
            substitutes.forEach((s: any) => {
              responseText += `- **${s.name}**: ${s.reason}\n`;
            });
          } else {
            responseText = `I'm not sure about direct substitutes for **${ingredient}**, but I can try to help if you tell me what you're making!`;
          }
          setMsgs(prev => [...prev, { role: 'assistant', text: responseText }]);
        } catch (err) {
          const response = await ai.getChefResponse(userMsg, currentRecipe?.title);
          setMsgs(prev => [...prev, { role: 'assistant', text: response || "" }]);
        }
      } else {
        const response = await ai.getChefResponse(userMsg, currentRecipe?.title);
        setMsgs(prev => [...prev, { role: 'assistant', text: response || "" }]);
      }
      setIsTyping(false);
    };

    return (
      <div className="flex flex-col h-screen bg-warm-bg">
        <header className="p-6 bg-white border-b border-black/5 flex items-center gap-4 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => navigate('home')}>
             <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-bold italic">Chef AI</h1>
            <div className="flex items-center gap-1.5 opacity-60">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-widest">Always fresh</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto text-charcoal/40 hover:text-red-500 gap-2 font-bold"
            onClick={() => {
              if (confirm("Clear all messages?")) {
                setMsgs([{ role: 'assistant', text: "Chat cleared! How can I help you now? 👋" }]);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {msgs.map((m, i) => (
            <div key={i} className={cn("flex w-full", m.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] p-5 rounded-3xl leading-relaxed shadow-deep text-sm font-medium",
                m.role === 'user' ? "bg-secondary text-white" : "bg-primary text-white rounded-bl-none prose prose-invert"
              )}>
                {m.role === 'assistant' && <div className="text-[10px] uppercase tracking-[2px] opacity-60 mb-2 font-bold">Chef AI</div>}
                <Markdown>{m.text}</Markdown>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-primary/20 p-4 rounded-full shadow-soft flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-6 bg-white border-t border-black/5 pb-10">
          <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
            {[
              { label: 'Substitutions?', value: 'Substitute for ' },
              { label: 'Calories?', value: 'How many calories are in this?' },
              { label: 'Storage tips', value: 'How to keep it fresh?' },
              { label: 'Cooking tips', value: 'Any cooking tips?' }
            ].map(q => (
              <button 
                key={q.label}
                onClick={() => setInput(q.value)}
                className="px-4 py-2 bg-black/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap hover:bg-primary/10 hover:text-primary transition-all"
              >
                {q.label}
              </button>
            ))}
          </div>
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Input 
                placeholder={isListening ? "Listening..." : "Ask me anything..."} 
                className={cn(
                  "pr-16 h-16 rounded-[24px] transition-all",
                  isListening && "border-primary ring-2 ring-primary/20"
                )}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button 
                size="icon" 
                variant="ghost"
                className={cn("absolute right-2 top-2 h-12 w-12 rounded-xl text-charcoal/50 hover:text-primary", isListening && "text-primary animate-pulse")}
                onClick={toggleListening}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
            </div>
            <Button size="icon" className="h-16 w-16 rounded-[24px] shrink-0" onClick={handleSend}>
              <Send className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const GroceryList = () => {
    return (
      <div className="min-h-screen pb-40 px-6 pt-12 max-w-2xl mx-auto space-y-8">
        <header className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold italic">Grocery List 🛒</h1>
            <p className="text-charcoal/50 text-sm font-medium">{state.groceryList.filter(i => !i.checked).length} items remaining</p>
          </div>
          <Button variant="outline" size="icon" className="rounded-2xl border-primary/20 bg-white">
            <Share2 className="w-5 h-5" />
          </Button>
        </header>

        <section className="space-y-4">
          <div className="space-y-3 pt-4">
            {state.groceryList.length === 0 ? (
              <div className="py-20 text-center space-y-4 text-charcoal/30">
                <ShoppingCart className="w-20 h-20 mx-auto opacity-20" />
                <p className="italic">Your list is empty. Add items from recipes!</p>
              </div>
            ) : (
              state.groceryList.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => toggleGroceryItem(item.id)}
                  className={cn(
                    "flex items-center justify-between p-5 rounded-3xl border border-black/5 transition-all cursor-pointer shadow-soft",
                    item.checked ? "bg-black/5 opacity-50" : "bg-white"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all", item.checked ? "bg-accent border-accent" : "border-black/10")}>
                      {item.checked && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={cn("font-bold text-charcoal", item.checked && "line-through opacity-50")}>{item.name}</span>
                      <span className="text-[10px] font-bold uppercase text-charcoal/40 tracking-widest">{item.amount}</span>
                    </div>
                  </div>
                  <X 
                    className="w-5 h-5 text-charcoal/20 hover:text-red-500 transition-colors" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setState(prev => ({
                        ...prev,
                        groceryList: prev.groceryList.filter(i => i.id !== item.id)
                      }));
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    );
  };

  const Profile = () => {
    return (
      <div className="min-h-screen pb-40 px-6 pt-16 max-w-2xl mx-auto space-y-12">
        <header className="flex flex-col items-center text-center space-y-6">
          <div className="w-32 h-32 rounded-[48px] bg-primary/10 border-4 border-white shadow-deep flex items-center justify-center relative">
             <User className="w-16 h-16 text-primary" />
             <div className="absolute bottom-2 right-2 w-8 h-8 bg-accent rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                <Plus className="w-4 h-4 text-white" />
             </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold italic">Chef Master</h1>
            <p className="text-charcoal/40 font-bold uppercase tracking-widest text-[10px] mt-1">Gourmet Member</p>
          </div>
        </header>

        <section className="space-y-6">
          <div className="flex justify-between items-center px-1">
             <h2 className="text-xl font-bold italic">Saved Recipes</h2>
             <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{state.favorites.length} Saved</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {state.favorites.map(fid => {
              const r = MOCK_RECIPES.find(res => res.id === fid);
              if (!r) return null;
              return (
                <div 
                  key={fid} 
                  onClick={() => navigate('recipe-detail', { currentRecipeId: fid })}
                  className="aspect-square rounded-[32px] overflow-hidden relative group cursor-pointer shadow-soft"
                >
                  <img src={r.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={r.title} referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                    <span className="text-white font-bold text-xs italic">{r.title}</span>
                  </div>
                </div>
              )
            })}
            {state.favorites.length === 0 && (
               <div className="col-span-2 py-12 text-center text-charcoal/30 bg-black/5 rounded-[40px] border-2 border-dashed border-black/5">
                  <p className="italic font-medium">No saved recipes yet. Explore and like some!</p>
               </div>
            )}
          </div>
        </section>

        <div className="space-y-2">
          {['Account Settings', 'Preferences', 'Help Center', 'About HomeChef'].map(opt => (
            <button key={opt} className="w-full flex items-center justify-between p-5 rounded-3xl hover:bg-white hover:shadow-soft transition-all group">
              <span className="font-bold text-charcoal/70 group-hover:text-charcoal transition-colors">{opt}</span>
              <ChevronLeft className="w-5 h-5 rotate-180 text-charcoal/30" />
            </button>
          ))}
        </div>

        <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 font-bold h-14 rounded-2xl flex gap-2" onClick={() => navigate('splash')}>
          <LogOut className="w-5 h-5" /> Logout
        </Button>
      </div>
    );
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Card 
      onClick={() => navigate('recipe-detail', { currentRecipeId: recipe.id })}
      className="flex flex-col sm:flex-row gap-6 p-4 cursor-pointer hover:border-primary/30 transition-all group"
    >
      <div className="relative w-full sm:w-32 h-32 shrink-0 overflow-hidden rounded-2xl">
        <img src={recipe.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={recipe.title} referrerPolicy="no-referrer" />
        <button 
          onClick={(e) => toggleFavorite(recipe.id, e)}
          className="absolute top-2 right-2 p-2 glass rounded-xl shadow-soft"
        >
          <Heart className={cn("w-4 h-4", state.favorites.includes(recipe.id) && "fill-primary text-primary")} />
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-center space-y-2">
        <div className="flex justify-between items-start">
          <Badge>{recipe.category}</Badge>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Recipe ✨</span>
        </div>
        <h3 className="text-xl font-bold italic leading-tight group-hover:text-primary transition-colors">{recipe.title}</h3>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-charcoal/40">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary" /> {recipe.time}</span>
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-primary" /> {recipe.difficulty}</span>
        </div>
      </div>
    </Card>
  );

  const BottomBar = () => {
    const tabs = [
      { id: 'home', icon: ChefHat, label: 'Cook' },
      { id: 'ingredients', icon: Search, label: 'Search' },
      { id: 'chat', icon: MessageSquare, label: 'AI Chef' },
      { id: 'grocery', icon: ShoppingCart, label: 'List' },
      { id: 'profile', icon: User, label: 'Me' }
    ];

    if (['splash', 'onboarding', 'recipe-detail', 'cooking-mode'].includes(state.currentScreen)) return null;

    return (
      <div className="fixed bottom-8 left-6 right-6 z-50 max-w-lg mx-auto">
        <div className="bg-charcoal/95 backdrop-blur-xl rounded-[32px] p-2 flex justify-between items-center shadow-2xl ring-1 ring-white/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id as Screen)}
              className={cn(
                "flex items-center gap-2 py-3 px-4 rounded-2xl transition-all duration-300",
                state.currentScreen === tab.id ? "bg-primary text-white scale-105" : "text-white/40 hover:text-white/60"
              )}
            >
              <tab.icon className={cn("w-6 h-6", state.currentScreen === tab.id && "animate-pulse")} />
              {state.currentScreen === tab.id && (
                <span className="text-sm font-bold truncate max-w-[60px]">{tab.label}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary/20 bg-warm-bg overflow-x-hidden">
      <AnimatePresence mode="wait">
        {state.currentScreen === 'splash' && <SplashScreen key="splash" />}
        {state.currentScreen === 'onboarding' && <Onboarding key="onboarding" />}
        {state.currentScreen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Dashboard />
          </motion.div>
        )}
        {state.currentScreen === 'ingredients' && (
          <motion.div key="ingredients" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
            <IngredientInput />
          </motion.div>
        )}
        {state.currentScreen === 'recipe-list' && (
          <motion.div key="recipe-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RecipeList />
          </motion.div>
        )}
        {state.currentScreen === 'recipe-detail' && (
          <motion.div key="recipe-detail" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 20, stiffness: 100 }}>
            <RecipeDetail />
          </motion.div>
        )}
        {state.currentScreen === 'chat' && (
          <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ChatBot />
          </motion.div>
        )}
        {state.currentScreen === 'cooking-mode' && (
          <motion.div key="cooking-mode" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
            <CookingMode />
          </motion.div>
        )}
        {state.currentScreen === 'grocery' && (
          <motion.div key="grocery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GroceryList />
          </motion.div>
        )}
        {state.currentScreen === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Profile />
          </motion.div>
        )}
      </AnimatePresence>
      <BottomBar />
    </div>
  );
}
