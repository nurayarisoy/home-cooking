import Image from "next/image";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaMapMarkerAlt } from "react-icons/fa";

const navigation = [
  { name: "Startseite", href: "/" },
  { name: "Über uns", href: "/about" },
  { name: "Kontakt", href: "/contact" },
  { name: "Rezeptvorschlag", href: "/recibe" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const WhiteNavbar = () => {
  return (
    <Disclosure as="nav" className="bg-slate-950 text-white shadow-lg shadow-slate-900/10">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-6">
              <Link href="/" className="flex items-center gap-3">
                <span className="relative h-12 w-12 rounded-full bg-orange-500/10 p-1">
                  <Image src="/chef1.png" alt="Home Cooking" fill className="rounded-full object-cover" />
                </span>
                <span className="text-xl font-semibold tracking-tight text-white">Home Cooking</span>
              </Link>

              <div className="hidden md:flex items-center gap-4">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href} className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white">
                    {item.name}
                  </Link>
                ))}
                <Link href="/locations" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600">
                  <FaMapMarkerAlt className="h-4 w-4" />
                  Standorte
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-3">
                  <Link href="/login" className="rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                    Anmeldung
                  </Link>
                  <Link href="/register" className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">
                    Registrieren
                  </Link>
                </div>
                <Disclosure.Button className="inline-flex items-center justify-center rounded-full border border-white/20 p-2 text-white transition hover:bg-white/10 md:hidden">
                  <span className="sr-only">Hauptmenü öffnen</span>
                  {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-2 px-6 pb-6">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="block rounded-2xl bg-slate-900/90 px-4 py-3 text-base font-medium text-white transition hover:bg-slate-800">
                  {item.name}
                </Link>
              ))}
              <Link href="/locations" className="block rounded-2xl bg-orange-500 px-4 py-3 text-base font-medium text-white transition hover:bg-orange-600">
                Standorte
              </Link>
              <Link href="/login" className="block rounded-2xl bg-slate-900/90 px-4 py-3 text-base font-medium text-white transition hover:bg-slate-800">
                Anmeldung
              </Link>
              <Link href="/register" className="block rounded-2xl bg-orange-500 px-4 py-3 text-base font-medium text-white transition hover:bg-orange-600">
                Registrieren
              </Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default WhiteNavbar;
