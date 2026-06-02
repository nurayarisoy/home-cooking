import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Personalisierte Rezepte",
    description: "Füge Zutaten hinzu und erhalte schnell eine Rezeptidee, die zu deinem Vorrat passt.",
  },
  {
    title: "Mit Fotos teilen",
    description: "Teile deine Rezepte mit Bild- oder Video-Vorschau aus deiner Küche.",
  },
  {
    title: "Favoriten speichern",
    description: "Speichere deine besten Rezepte und finde sie jederzeit wieder.",
  },
];

const Main = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-100 to-amber-50">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.24),transparent_40%)] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm ring-1 ring-orange-200">
              <span>Jetzt Kochideen sammeln</span>
              <span className="rounded-full bg-orange-600 px-2 py-1 text-white text-xs">Neu</span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                Zu Hause kochen, teilen und inspirieren.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
                Home Cooking hilft dir, aus deinen Zutaten schnell neue Rezepte zu erstellen, eigene Rezepte zu teilen und andere Küchen zu inspirieren.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/recibe" className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-orange-700">
                Rezeptvorschlag
              </Link>
              <Link href="/kochen" className="inline-flex items-center justify-center rounded-full border border-orange-600 bg-white px-6 py-3 text-base font-semibold text-orange-700 shadow-sm transition hover:bg-orange-50">
                Rezept teilen
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-orange-200 bg-white/90 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-orange-700">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2.25rem] bg-gradient-to-br from-orange-100 to-amber-100 blur-3xl opacity-80" />
            <div className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/90 p-4 shadow-2xl shadow-orange-200/20">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem]">
                <Image src="/chef.webp" alt="Cooking hero image" fill className="object-cover" />
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-orange-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">Rezept der Woche</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">Cremige Pilz-Pasta</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-sm">
                    <p className="text-sm text-slate-300">Vorbereitung</p>
                    <p className="mt-2 text-xl font-semibold">15 Min.</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-sm">
                    <p className="text-sm text-slate-300">Portionen</p>
                    <p className="mt-2 text-xl font-semibold">4 Personen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
