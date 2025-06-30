import { useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default function Recibe() {
  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    if (ingredient.trim() !== '') {
      setIngredients([...ingredients, ingredient.trim()]);
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
    } catch (error) {
      console.error(error);
      alert('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">🍳 AI Yemek Tarifi Önerisi</h1>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          placeholder="Malzeme ekleyin..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addIngredient}
          className="bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold px-4 py-2 rounded-lg"
        >
          Ekle
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
              >
                <XCircleIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400 mb-4">Henüz malzeme eklemediniz.</p>
      )}

      <button
        onClick={getRecipe}
        className="w-full bg-green-500 hover:bg-green-600 transition-colors text-white font-semibold py-2 rounded-lg mb-4"
      >
        Öneri Al
      </button>

      {loading && (
        <p className="text-center text-gray-500">Yükleniyor...</p>
      )}

      {suggestion && (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 p-4 rounded-lg mt-4">
          <h2 className="font-bold mb-2">AI Önerisi:</h2>
          <p>{suggestion}</p>
        </div>
      )}
    </div>
  );
}
