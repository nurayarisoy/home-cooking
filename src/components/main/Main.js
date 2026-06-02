import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Personalized recipes",
    description: "Add ingredients and get an instant meal idea tailored to your pantry.",
  },
  {
    title: "Publish with photos",
    description: "Share beautiful recipes with images or video previews from your kitchen.",
  },
  {
    title: "Track favorites",
    description: "Save your best recipes and revisit them whenever inspiration strikes.",
  },
];

const Main = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-100">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.22),transparent_40%)] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm ring-1 ring-orange-200">
              <span>Yemek tariflerini yenile</span>
              <span className="rounded-full bg-orange-600 px-2 py-1 text-white text-xs">Yeni</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Evde pişir, paylaş, ilham ol.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-700">
              Home Cooking ile malzemelerinden hızlıca yeni tarifler üret, kendi tariflerini paylaş ve herkesin mutfağına lezzet kat.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/recibe" className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-orange-700">
                Tarif Önerisi Al
              </Link>
              <Link href="/kochen" className="inline-flex items-center justify-center rounded-full border border-orange-600 bg-white px-6 py-3 text-base font-semibold text-orange-700 shadow-sm transition hover:bg-orange-50">
                Tarifini Paylaş
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
            <div className="overflow-hidden rounded-[2rem] border border-orange-200 bg-white/90 p-4 shadow-2xl shadow-orange-200/20 backdrop-blur-xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem]">
                <Image src="/chef.webp" alt="Cooking hero image" fill className="object-cover" />
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-orange-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">Haftanın Reçetesi</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">Kremalı mantarlı makarna</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-sm">
                    <p className="text-sm text-slate-300">Hazırlık</p>
                    <p className="mt-2 text-xl font-semibold">15 dk</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-sm">
                    <p className="text-sm text-slate-300">Porsiyon</p>
                    <p className="mt-2 text-xl font-semibold">4 kişi</p>
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
