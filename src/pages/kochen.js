import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import api from "../utils/axios";

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
      let mediaUrl = null;
      let mediaType = null;

      if (media) {
        const uploadData = new FormData();
        uploadData.append("file", media);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        if (!uploadRes.ok) {
          const errorResponse = await uploadRes.json();
          throw new Error(errorResponse.message || "Media upload failed");
        }

        const uploadJson = await uploadRes.json();
        mediaUrl = uploadJson.url;
        mediaType = uploadJson.mediaType;
      }

      await api.post("/api/recipes", {
        title,
        description,
        mediaUrl,
        mediaType,
        published: 1,
      });

      setMessage("✅ Dein Rezept wurde erfolgreich veröffentlicht!");
      setTitle("");
      setDescription("");
      setMedia(null);
      setPreview(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Beim Hochladen des Rezepts ist ein Fehler aufgetreten.";
      setMessage(`❌ ${errorMsg}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-100 py-12">
      <Head>
        <title>Rezepte teilen | Home Cooking</title>
      </Head>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1fr] items-start">
          <div className="rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Neues Rezept</p>
                <h1 className="mt-4 text-4xl font-extrabold text-slate-900">Teile dein Rezept</h1>
              </div>
              <div className="rounded-3xl bg-orange-100 px-4 py-3 text-sm font-semibold text-orange-700">
                Sofort veröffentlichen
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
              Teile dein Rezept mit Fotos oder Videos, damit es noch ansprechender wird. Bis zu 10 veröffentlichte Rezepte erscheinen auf der Startseite.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-orange-50 p-6 shadow-sm ring-1 ring-orange-100">
                <h2 className="font-semibold text-slate-900">Mit Video hervorheben</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Nimm deine Zubereitung auf und zeige dein Gericht in Aktion.
                </p>
              </div>
              <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-sm ring-1 ring-slate-900/10">
                <h2 className="font-semibold">Schnell geteilt</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Füge Zutaten, Anleitung und Medien hinzu und veröffentliche in wenigen Minuten.
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-[1.75rem] border border-dashed border-orange-200 bg-orange-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-700">Hinweis</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Hochgeladene Medien werden im `public/uploads`-Ordner gespeichert und als Vorschau angezeigt.
              </p>
              <p className="mt-4 text-sm text-slate-600">Maximale Videogröße: 100MB.</p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl ring-1 ring-slate-900/20">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">Rezept veröffentlichen</p>
              <h2 className="mt-4 text-3xl font-bold">Teile dein Rezept mit Bild oder Video</h2>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-200">
                  Rezepttitel
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Zum Beispiel: Würziger Gemüseauflauf"
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950 px-5 py-3 text-slate-100 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-200">
                  Rezeptbeschreibung
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Schreibe hier deine Zubereitungsschritte..."
                  rows={6}
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950 px-5 py-3 text-slate-100 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>

              <div>
                <label htmlFor="media" className="block text-sm font-medium text-slate-200">
                  Bild oder Video hinzufügen
                </label>
                <input
                  id="media"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="mt-3 block w-full text-sm text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                />
              </div>

              {preview && (
                <div className="rounded-3xl border border-orange-600 bg-slate-900/70 p-4">
                  {media && media.type.startsWith("image/") ? (
                    <img
                      src={preview}
                      alt="Vorschau"
                      className="mx-auto max-h-72 rounded-3xl object-cover"
                    />
                  ) : (
                    <video controls className="mx-auto max-h-72 rounded-3xl">
                      <source src={preview} />
                    </video>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-3xl bg-orange-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-400"
              >
                Veröffentlichen
              </button>
            </form>

            <div className="mt-8 rounded-3xl bg-slate-900/80 p-5 text-sm text-slate-300 ring-1 ring-slate-700">
              <p className="font-semibold text-slate-100">Live-Vorschau</p>
              <p className="mt-3 leading-6">
                Deine Rezepte erscheinen direkt auf der Startseite, damit andere sie entdecken können. Die neuesten 10 Beiträge werden besonders hervorgehoben.
              </p>
              <Link href="/" className="mt-5 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-orange-400">
                Zur Startseite
              </Link>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-8 rounded-[2rem] bg-white/90 p-6 text-center text-slate-900 shadow-xl ring-1 ring-slate-200">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
