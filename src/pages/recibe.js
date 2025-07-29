import { useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default function Recibe() {
  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [suggestion, setSuggestion] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    const trimmed = ingredient.trim();
    if (trimmed !== '' && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setIngredient('');
    }
  };

  const removeIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, i) => i !== indexToRemove));
  };

  const getRecipe = async () => {
    if (ingredients.length === 0) {
      alert('Lütfen en az bir malzeme ekleyin.');
      return;
    }

    setLoading(true);
    setSuggestion('');
    setRecipe(null);

    try {
      const res = await fetch('http://localhost:3001/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      if (!res.ok) {
        throw new Error('Sunucu hatası');
      }

      const data = await res.json();
      setSuggestion(data.suggestion);
      setRecipe(data.recipe || null);
    } catch (error) {
      console.error(error);
      alert('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">🍳 AI Recipe Suggestion</h1>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add ingredient..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addIngredient}
          className="bg-red-500 hover:bg-red-600 transition-colors text-white font-semibold px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </div>

      {ingredients.length > 0 ? (
        <ul className="mb-4 flex flex-wrap gap-2">
          {ingredients.map((item, index) => (
            <li
              key={index}
              className="flex items-center bg-gray-100 border border-gray-200 px-3 py-1 rounded-full text-sm"
            >
              {item}
              <button
                onClick={() => removeIngredient(index)}
                className="ml-2 text-gray-500 hover:text-red-500"
                aria-label={`Remove ${item}`}
              >
                <XCircleIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400 mb-4">You haven't added any ingredients yet.</p>
      )}

      <button
        onClick={getRecipe}
        className="w-full bg-red-500 hover:bg-red-600 transition-colors text-white font-semibold py-2 rounded-lg mb-4"
      >
        Get Suggestion
      </button>

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {suggestion && !recipe && (
        <div className="bg-red-50 border border-red-400 text-red-800 p-4 rounded-lg mt-4">
          <h2 className="font-bold mb-2">AI Suggestion:</h2>
          <p>{suggestion}</p>
        </div>
      )}

      {recipe && (
        <div className="bg-white border border-gray-200 shadow-md p-6 rounded-lg mt-6">
          <h2 className="text-2xl font-bold mb-2">{recipe.name}</h2>
          {recipe.image && (
           <img
  src={recipe.image}
  alt={recipe.name}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/default.jpg";
  }}
  className="w-full h-auto rounded-lg shadow-md mb-4"
/>

            
          )}
          <h3 className="font-semibold text-lg">Ingredients:</h3>
          <ul className="list-disc list-inside mb-4">
            {recipe.ingredients.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <h3 className="font-semibold text-lg">Instructions:</h3>
          <p className="text-gray-700">{recipe.instructions}</p>
        </div>
      )}

      <a href="/" className="absolute top-4 left-4 z-10">
        <img
          className="h-16 w-16 animate-spin object-cover rounded-full transform hover:scale-110 transition-transform duration-300"
          src="/chef1.png"
          alt="Logo"
        />
      </a>

      {/* Left Image (only for medium+ screens) */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/chef.png')" }}
      ></div>

      {/* Image for small screens */}
      <div
        className="md:hidden w-full h-64 bg-cover bg-center"
        style={{ backgroundImage: "url('/chef.png')" }}
      ></div>
    </div>
  );
}
