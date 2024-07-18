import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const navigation = [
  { name: "Home", href: "/", current: false },
  { name: "About", href: "/about", current: false },
  { name: "Contact", href: "/contact", current: false },
  { name: "Login", href: "/login", current: false },
  { name: "Register", href: "/register", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const WhiteNavbar = () => {
  return (
    <Disclosure as="nav" className="bg-gray-500">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 transform hover:scale-175 tw-shadow-color: transparent">
                  <img
                    className="h-12 w-auto animate-spin  object-cover rounded-full" // Arka plan transparan yapıldı
                    src="/chef1.png" // Logo resmi buraya eklenmeli
                    alt="Logo"


                  />
                </div>
                <div className="ml-4 text-lg font-bold text-white hidden lg:block">
                  Home Cooking
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href} legacyBehavior>
                        <a
                          className={classNames(
                            "bg-red-500 text-white py-4 px-8 rounded transition duration-500 ease-in-out transform hover:scale-105",
                            "block px-3 py-2 rounded-md text-base font-medium"
                          )}
                        >
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    "bg-red-500 text-white py-4 px-8 rounded hover:bg-red-700",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default WhiteNavbar;
