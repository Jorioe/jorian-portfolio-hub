
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Projecten", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="header">
      <nav className="container flex items-center justify-between p-6" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="p-1">
            <span className="text-2xl font-bold">Jorian Bracke</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-link ${
                location.pathname === item.href
                  ? "nav-link-active"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <ThemeToggle />
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? "fixed inset-0 z-50" : "hidden"}`}>
        <div className="fixed inset-0 bg-background/80" style={{ backdropFilter: "blur(4px)" }} />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6" style={{ maxWidth: "24rem" }}>
          <div className="flex items-center justify-between">
            <Link to="/" className="p-1" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-2xl font-bold">Jorian Bracke</span>
            </Link>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="space-y-2 py-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block rounded-lg px-3 py-2 text-base font-semibold ${
                    location.pathname === item.href
                      ? "nav-link-active"
                      : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="py-6">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
