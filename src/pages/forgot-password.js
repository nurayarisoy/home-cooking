import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password reset request for:', email);
    setMessage('Wenn ein Konto mit dieser E-Mail existiert, wurde ein Zurücksetzungslink gesendet.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-100 py-16">
      <Head>
        <title>Passwort vergessen | Home Cooking</title>
      </Head>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200">
            <h1 className="text-4xl font-extrabold text-slate-950">Passwort zurücksetzen</h1>
            <p className="mt-5 text-slate-600 leading-7">
              Gib die E-Mail-Adresse deines Kontos ein, um einen Link zum Zurücksetzen des Passworts zu erhalten.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  E-Mail-Adresse
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@beispiel.de"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-3xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-700"
              >
                Link senden
              </button>
            </form>
            {message && <p className="mt-6 text-sm text-emerald-600">{message}</p>}
            <div className="mt-6 text-center text-sm text-slate-500">
              <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700">
                Zurück zur Anmeldung
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
