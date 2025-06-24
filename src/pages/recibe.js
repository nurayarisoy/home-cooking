import { useState } from 'react';

export default function Home() {
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const getRecipe = async () => {
    setLoading(true);
   const res = await fetch('http://localhost:3001/ai/recommend', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients: ['yumurta', 'peynir'] }),
    });

    const data = await res.json();
    setSuggestion(data.suggestion);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={getRecipe}>Öneri Al</button>

      {loading && <p>Yükleniyor...</p>}

      {!loading && suggestion && (
        <div>
          <h2>AI Önerisi:</h2>
          <p>{suggestion}</p>
        </div>
      )}
    </div>
  );
}
