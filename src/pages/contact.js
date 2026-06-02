import Head from 'next/head';
import Link from 'next/link';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 py-16">
      <Head>
        <title>Kontakt | Home Cooking</title>
      </Head>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Kontakt</p>
            <h1 className="mt-4 text-4xl font-extrabold text-slate-950">Schreib uns eine Nachricht</h1>
            <p className="mt-6 text-slate-600 leading-7">
              Wir helfen dir gerne weiter. Schreibe uns bei Fragen zu Rezepten, Uploads oder der Community.
            </p>

            <div className="mt-10 space-y-4 text-sm text-slate-600">
              <p>📧 info@homecooking.com</p>
              <p>📞 +49 30 1234 5678</p>
              <p>🏠 Berlin, Deutschland</p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Dein Name"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  E-Mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="email@beispiel.de"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                  Nachricht
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Deine Nachricht"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full rounded-3xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-700"
              >
                Nachricht senden
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-slate-500">
              <Link href="/forgot-password" className="font-semibold text-orange-600 hover:text-orange-700">
                Passwort vergessen?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
