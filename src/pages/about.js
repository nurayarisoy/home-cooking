import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-100">
      <Head>
        <title>Über uns | Home Cooking</title>
      </Head>

      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="mb-10 flex items-center justify-between rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Über uns</p>
            <h1 className="mt-4 text-4xl font-extrabold text-slate-950">Willkommen bei Home Cooking</h1>
          </div>
          <Link href="/" className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-700">
            Zur Startseite
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900">Unsere Mission</h2>
            <p className="mt-5 text-slate-600 leading-7">
              Home Cooking ist deine Plattform für kreative Rezepte, die du einfach zu Hause nachkochen kannst. Teile Fotos oder Videos deiner Gerichte und entdecke neue Ideen aus der Community.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900">Was dich erwartet</h2>
            <ul className="mt-5 space-y-4 text-slate-600">
              <li className="rounded-3xl border border-orange-200 bg-orange-50 p-4">
                <strong className="text-slate-900">Schnelle Rezeptideen</strong> basierend auf dem, was du zu Hause hast.
              </li>
              <li className="rounded-3xl border border-orange-200 bg-orange-50 p-4">
                <strong className="text-slate-900">Community-Uploads</strong> mit Bildern und Videos.
              </li>
              <li className="rounded-3xl border border-orange-200 bg-orange-50 p-4">
                <strong className="text-slate-900">Einfache Bedienung</strong> für Anfänger und erfahrene Hobbyköche.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
