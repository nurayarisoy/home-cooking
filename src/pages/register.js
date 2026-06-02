import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../utils/axios";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/register", {
        username,
        email,
        password,
      });

      alert(response.data.message);
      router.push("/welcome");
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Bei der Registrierung ist ein Fehler aufgetreten.";
      alert(errorMsg);
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-100 py-16">
      <Head>
        <title>Registrieren | Home Cooking</title>
      </Head>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200">
            <h1 className="text-4xl font-extrabold text-slate-950">Erstelle dein Konto</h1>
            <p className="mt-5 text-slate-600 leading-7">
              Registriere dich, um eigene Rezepte mit Fotos oder Videos zu teilen und die Community zu inspirieren.
            </p>
            <div className="mt-10 rounded-[1.75rem] bg-orange-50 p-6 shadow-sm ring-1 ring-orange-200">
              <h2 className="text-lg font-semibold text-slate-900">Was du bekommst</h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-600">
                <li>Eigene Rezepte veröffentlichen</li>
                <li>Mediengestützte Beiträge</li>
                <li>Neue Rezeptideen entdecken</li>
              </ul>
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-10 shadow-2xl ring-1 ring-slate-900/20 text-white">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">Neues Konto</p>
              <h2 className="mt-4 text-3xl font-bold">Jetzt registrieren</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-200">
                  Benutzername
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Benutzername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950 px-5 py-3 text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                  E-Mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="email@beispiel.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950 px-5 py-3 text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                  Passwort
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Mindestens 8 Zeichen"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950 px-5 py-3 text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-3xl bg-orange-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-orange-400"
              >
                Registrieren
              </button>
            </form>
            <div className="mt-6 text-sm text-slate-400">
              Du hast bereits ein Konto?{' '}
              <Link href="/login" className="text-orange-300 hover:text-orange-200">
                Jetzt anmelden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
