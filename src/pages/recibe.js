import { useState } from 'react';
import Head from 'next/head';

export default function RecipeForm() {
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeImage, setRecipeImage] = useState(null);
  const [recipes, setRecipes] = useState([]);

  const handleImageChange = (e) => {
    setRecipeImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (recipeTitle && recipeImage) {
      const formData = new FormData();
      formData.append('title', recipeTitle);
      formData.append('image', recipeImage);

      // Burada tarifi kaydetmek için API çağrısı yapmalısınız (örneğin, backend'de bir endpoint oluşturabilirsiniz)
      // const response = await fetch('http://localhost:5000/recipes', {
      //   method: 'POST',
      //   body: formData,
      // });

      // if (response.ok) {
      //   const newRecipe = await response.json();
      //   setRecipes([...recipes, newRecipe]);
      // }

      console.log('Recipe Title:', recipeTitle);
      console.log('Recipe Image:', recipeImage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>Recipe Form</title>
      </Head>
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipeTitle">
              Recipe Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="recipeTitle"
              type="text"
              value={recipeTitle}
              onChange={(e) => setRecipeTitle(e.target.value)}
              placeholder="Enter recipe title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipeImage">
              Recipe Image
            </label>
            <input
              className="block w-full text-sm text-gray-500
              file:mr-5 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
              id="recipeImage"
              type="file"
              onChange={handleImageChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
