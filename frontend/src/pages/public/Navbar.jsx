import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Departments", href: "/departments" },
  { name: "About Us", href: "/about" },
  { name: "Contact Desk", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const roleRoutes = {
    admin: "/admin",
    doctor: "/doctor",
    receptionist: "/receptionist",
    patient: "/patient",
  };

  const dashboardPath = user ? roleRoutes[user.roles] || "/" : "/login";
  const bookingPath = user ? "/user/appointment" : "/login";

  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-white/90 backdrop-blur-md">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-4 lg:px-8 max-w-7xl mx-auto"
      >
        {/* Logo brand */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2.5">
            <img src={Logo} alt="City Care Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-gray-900 text-sm font-extrabold tracking-wide uppercase">
                City Care
              </h1>
              <p className="text-[10px] text-teal-600 font-bold -mt-1 leading-none uppercase">
                Hospital Center
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-semibold text-gray-700 hover:text-teal-600 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          <Link
            to={dashboardPath}
            className="text-sm font-semibold text-gray-955 hover:text-teal-600 transition-colors mr-2"
          >
            {user ? "Dashboard" : "Login Portal"}
          </Link>
          <Link
            to={bookingPath}
            className="rounded-full bg-teal-600 px-4.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 transition-all cursor-pointer text-center"
          >
            Book Consultation
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 cursor-pointer"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="-m-1.5 p-1.5 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src={Logo} alt="City Care Logo" className="h-10 w-auto" />
              <span className="text-sm font-extrabold text-gray-955 tracking-wide uppercase">
                City Care
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 cursor-pointer"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 space-y-2">
                <Link
                  to={dashboardPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  {user ? "Dashboard" : "Login Portal"}
                </Link>
                <Link
                  to={bookingPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block w-full text-center rounded-lg bg-teal-600 px-3 py-2.5 text-base font-semibold text-white hover:bg-teal-500"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
