// src/pages/kochen.js
import { useState } from "react";
import Head from "next/head";
import api from "../utils/axios"; // backend axios instance

export default function Kochen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (media) {
        formData.append("media", media);
      }

      await api.post("/api/recipes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Recipe successfully published!");
      setTitle("");
      setDescription("");
      setMedia(null);
      setPreview(null);
    } catch (err) {
      setMessage("❌ Error uploading recipe!");
    }
    
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-6">
      <Head>
        <title>Kochen - Share Your Recipe</title>
      </Head>

      <h1 className="text-4xl font-extrabold text-center text-orange-800 mb-8 drop-shadow">
        🍳Share Your Own Recipe
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-orange-200"
      >
        {/* Yemek Adı */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Recipe Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-2 border-orange-300 focus:border-orange-500 rounded-lg px-4 py-2 focus:outline-none"
            placeholder="For example: Dumplings"
            required
          />
        </div>

        {/* Tarif */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
           Recipe
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border-2 border-orange-300 focus:border-orange-500 rounded-lg px-4 py-2 focus:outline-none"
            placeholder="Tarifinizi buraya yazın..."
            rows={6}
            required
          />
        </div>

        {/* Resim veya Video Yükleme */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
          Add Image or Video
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                       file:rounded-full file:border-0 file:text-sm file:font-semibold 
                       file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
          />
        </div>

        {/* Önizleme */}
        {preview && (
          <div className="mt-4">
            {media && media.type.startsWith("image/") ? (
              <img
                src={preview}
                alt="Preview"
                className="rounded-xl shadow-md max-h-64 mx-auto"
              />
            ) : (
              <video
                controls
                className="rounded-xl shadow-md max-h-64 mx-auto"
                src={preview}
              />
            )}
          </div>
        )}

        {/* Yayınla Butonu */}
        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition transform hover:scale-105 shadow-lg"
        >
          🚀Publish
        </button>
      </form>

      {message && (
        <p className="text-center mt-6 text-lg font-semibold text-green-700">
          {message}
        </p>
      )}
    </div>
  );
}
