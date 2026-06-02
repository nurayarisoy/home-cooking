import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
              <span>Home Cooking</span>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-400">
              Kendi tariflerinizle topluluğa katılın. Malzemelerinizden tarif oluşturun, yayınlayın ve başkalarının favorileri arasında yer alın.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/about" className="text-sm text-slate-300 transition hover:text-white">
                About
              </Link>
              <Link href="/contact" className="text-sm text-slate-300 transition hover:text-white">
                Contact
              </Link>
              <Link href="/recibe" className="text-sm text-slate-300 transition hover:text-white">
                Recibe
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">Quick links</h3>
            <div className="mt-6 grid gap-3 text-sm text-slate-400">
              <Link href="/login" className="transition hover:text-white">
                Login
              </Link>
              <Link href="/register" className="transition hover:text-white">
                Register
              </Link>
              <Link href="/kochen" className="transition hover:text-white">
                Share recipe
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">Contact</h3>
            <p className="mt-6 text-sm leading-7 text-slate-400">
              info@homecooking.com
              <br />
              +90 555 123 45 67
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Link href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded-2xl bg-slate-900 p-3 transition hover:bg-slate-800">
                <Image src="/facebook.png" alt="Facebook" width={28} height={28} />
              </Link>
              <Link href="https://x.com" target="_blank" rel="noreferrer" className="rounded-2xl bg-slate-900 p-3 transition hover:bg-slate-800">
                <Image src="/x.png" alt="X" width={28} height={28} />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-2xl bg-slate-900 p-3 transition hover:bg-slate-800">
                <Image src="/instagram.png" alt="Instagram" width={28} height={28} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          © 2026 Home Cooking. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
