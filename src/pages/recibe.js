import { useState } from 'react';

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
      alert('Bitte füge mindestens eine Zutat hinzu.');
      return;
    }

    setLoading(true);
    setSuggestion('');
    setRecipe(null);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      if (!res.ok) {
        throw new Error('Serverfehler');
      }

      const data = await res.json();
      setSuggestion(data.suggestion);
      setRecipe(data.recipe || null);
    } catch (error) {
      console.error(error);
      alert('Ein Fehler ist aufgetreten.');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-100 py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200">
        <h1 className="text-4xl font-extrabold text-slate-950 text-center mb-6">🍳 Rezeptvorschlag</h1>
        <p className="mx-auto max-w-2xl text-center text-slate-600 leading-7 mb-10">
          Gib deine Zutaten ein und erhalte ein passendes Rezept. Du kannst mehrere Zutaten hinzufügen und einzeln entfernen.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Zutat hinzufügen..."
            className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          />
          <button
            onClick={addIngredient}
            className="rounded-3xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Hinzufügen
          </button>
        </div>

        {ingredients.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-3">
            {ingredients.map((item, index) => (
              <li key={index} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700">
                {item}
                <button
                  onClick={() => removeIngredient(index)}
                  className="rounded-full p-1 text-slate-500 transition hover:text-red-500"
                  aria-label={`Entferne ${item}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-slate-400">Du hast noch keine Zutaten hinzugefügt.</p>
        )}

        <button
          onClick={getRecipe}
          className="mt-6 w-full rounded-3xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Vorschlag erhalten
        </button>

        {loading && <p className="mt-6 text-center text-slate-500">Lädt...</p>}

        {suggestion && !recipe && (
          <div className="mt-8 rounded-[1.75rem] border border-orange-200 bg-orange-50 p-6 text-slate-700">
            <h2 className="text-xl font-semibold mb-3">Vorschlag</h2>
            <p>{suggestion}</p>
          </div>
        )}

        {recipe && (
          <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">{recipe.name}</h2>
            {recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default.jpg';
                }}
                className="w-full rounded-3xl object-cover shadow-sm mb-6"
              />
            )}
            <div className="space-y-5 text-slate-700">
              <div>
                <h3 className="font-semibold text-lg">Zutaten</h3>
                <ul className="list-disc list-inside mt-3 space-y-2">
                  {recipe.ingredients.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Anleitung</h3>
                <p className="mt-3 leading-7">{recipe.instructions}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
