import Link from "next/link";
import WhiteNavbar from "../components/navbar/WhiteNavbar";
import Footer from "../components/footer/Footer";
import Main from "../components/main/Main";

function RecipeCard({ recipe }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
      {recipe.media_url ? (
        recipe.media_type === "video" ? (
          <div className="relative h-64 overflow-hidden bg-slate-900">
            <video controls className="h-full w-full object-cover">
              <source src={recipe.media_url} type="video/mp4" />
              Dein Browser unterstützt das Video-Tag nicht.
            </video>
          </div>
        ) : (
          <img src={recipe.media_url} alt={recipe.title} className="h-64 w-full object-cover" />
        )
      ) : (
        <div className="flex h-64 items-center justify-center bg-orange-50 text-orange-700">Keine Medienvorschau</div>
      )}
      <div className="space-y-4 p-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{recipe.title}</h2>
          <p className="mt-2 text-sm text-slate-500">{recipe.author_email ? recipe.author_email : "Anonym"}</p>
        </div>
        <p className="text-sm leading-6 text-slate-600 line-clamp-4">
          {recipe.description || recipe.instructions_text || "Keine Beschreibung verfügbar."}
        </p>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{new Date(recipe.created_at).toLocaleDateString("de-DE")}</span>
          <Link href="/kochen" className="rounded-full bg-orange-600 px-4 py-2 text-white transition hover:bg-orange-700">
            Ansehen
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Home({ recipes }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <WhiteNavbar />
      <Main />

      <section className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Geteilte Rezepte</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">Die neuesten 10 Rezepte auf der Startseite</h2>
            </div>
            <Link
              href="/kochen"
              className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-700"
            >
              Eigenes Rezept teilen
            </Link>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-6 text-slate-600">
            Hier findest du Rezepte von anderen Nutzerinnen und Nutzern mit Bildern oder Videos. Lass dich inspirieren und teile dein eigenes Gericht.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {(recipes.length > 0 ? recipes : Array.from({ length: 3 })).map((recipe, index) =>
              recipe ? (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ) : (
                <div key={index} className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-400">
                  Warte auf ein neues Rezept.
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export async function getServerSideProps() {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  try {
    const res = await fetch(`${baseUrl}/api/recipes?published=1`);
    const recipes = await res.json();
    return {
      props: {
        recipes: Array.isArray(recipes) ? recipes.slice(0, 10) : [],
      },
    };
  } catch (error) {
    console.error("Homepage fetch error:", error);
    return {
      props: {
        recipes: [],
      },
    };
  }
}
