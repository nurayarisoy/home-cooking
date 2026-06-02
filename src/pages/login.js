import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../utils/axios";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const updatedValidations = {
      minLength: value.length >= 8,
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };

    setValidations(updatedValidations);
    setError(
      Object.values(updatedValidations).every(Boolean)
        ? ""
        : "Das Passwort muss alle Anforderungen erfüllen."
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Object.values(validations).every(Boolean)) {
      setError("Das Passwort muss alle Anforderungen erfüllen.");
      return;
    }

    try {
      const response = await api.post("/api/login", { email, password });
      alert(response.data.message);
      router.push("/kochen");
    } catch (err) {
      const msg = err?.response?.data?.message || "Anmeldung fehlgeschlagen.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-100">
      <Head>
        <title>Anmelden | Home Cooking</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-10 text-white shadow-2xl shadow-slate-900/10 lg:flex-1 lg:p-14">
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-orange-500/20 to-transparent" />
          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-200 shadow-sm ring-1 ring-orange-300/20">
              <span>Rezeptideen</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Bereit, dein Rezept zu teilen?
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
              Melde dich an und präsentiere deine besten Gerichte mit Fotos oder Videos der Community.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-900/10">
                <p className="text-xs uppercase tracking-[0.3em] text-orange-300">Gemüse Rezept</p>
                <h2 className="mt-4 text-xl font-semibold text-white">Gerösteter Blumenkohl</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Ein würziges Gemüsegericht mit Zucchini, Blumenkohl und Brokkoli.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-900/10">
                <p className="text-xs uppercase tracking-[0.3em] text-orange-300">Zweites Rezept</p>
                <h2 className="mt-4 text-xl font-semibold text-white">Pilz-Spinat-Auflauf</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Teile ein schnelles Gericht mit Video- oder Bildsupport.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-600">
                Jetzt registrieren
              </Link>
              <Link href="/kochen" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                Rezepte entdecken
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 bottom-10 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />
        </div>

        <div className="mt-10 lg:mt-0 lg:flex-[0.9]">
          <div className="rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-slate-900/5 ring-1 ring-slate-200">
            <div className="mb-8 flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-3xl bg-orange-100">
                <Image src="/chef1.png" alt="Home Cooking logo" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Bei Home Cooking anmelden</p>
                <p className="text-sm text-slate-500">Benutzername oder E-Mail und Passwort verwenden.</p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                  E-Mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="email@beispiel.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                  Passwort
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Mindestens 8 Zeichen"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full rounded-3xl border px-5 py-3 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 ${
                    error ? "border-red-500" : "border-slate-200"
                  }`}
                  required
                />
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
              </div>

              <div className="grid gap-3 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Passwortanforderungen</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <span className={validations.minLength ? "text-emerald-600" : "text-slate-400"}>
                    {validations.minLength ? "✓" : "○"} Mindestens 8 Zeichen
                  </span>
                  <span className={validations.hasUpperCase ? "text-emerald-600" : "text-slate-400"}>
                    {validations.hasUpperCase ? "✓" : "○"} Großbuchstabe
                  </span>
                  <span className={validations.hasLowerCase ? "text-emerald-600" : "text-slate-400"}>
                    {validations.hasLowerCase ? "✓" : "○"} Kleinbuchstabe
                  </span>
                  <span className={validations.hasNumber ? "text-emerald-600" : "text-slate-400"}>
                    {validations.hasNumber ? "✓" : "○"} Zahl
                  </span>
                  <span className={validations.hasSpecialChar ? "text-emerald-600" : "text-slate-400"}>
                    {validations.hasSpecialChar ? "✓" : "○"} Sonderzeichen
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-3xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-300/40 transition hover:bg-orange-700"
              >
                Anmelden
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
              <Link href="/forgot-password" className="hover:text-slate-700">
                Passwort vergessen?
              </Link>
              <Link href="/register" className="font-semibold text-orange-600 hover:text-orange-700">
                Konto erstellen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
