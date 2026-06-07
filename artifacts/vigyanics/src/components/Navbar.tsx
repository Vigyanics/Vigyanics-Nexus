import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Menu, X, Atom, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { totalItems, openCart } = useCart();
  const isStore = location.startsWith("/store");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainNavLinks = [
    { name: "Home", href: "#home" },
    { name: "Programs", href: "#programs" },
    { name: "Schools & ATL", href: "#schools" },
    { name: "Projects", href: "#projects" },
    { name: "Success Stories", href: "#success" },
    { name: "About Us", href: "#about" },
  ];

  const storeNavLinks = [
    { name: "All Products", href: "#featured-products" },
    { name: "Best Sellers", href: "#best-sellers" },
    { name: "New Arrivals", href: "#new-arrivals" },
    { name: "School Packs", href: "#school-solutions" },
  ];

  const navLinks = isStore ? storeNavLinks : mainNavLinks;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass-panel py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 group"
          onClick={(e) => { e.preventDefault(); navigate("/"); }}
        >
          <div className="w-10 h-10 rounded-lg bg-vigyanics-blue flex items-center justify-center text-white relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(0,212,255,0.6)] transition-all duration-300">
            <Atom className="w-6 h-6 animate-pulse-glow" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-vigyanics-blue dark:text-white">Vigyanics</span>
          {isStore && (
            <span className="hidden sm:flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-vigyanics-cyan/15 text-vigyanics-cyan text-xs font-bold border border-vigyanics-cyan/30">
              Store
            </span>
          )}
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-vigyanics-cyan dark:text-gray-300 dark:hover:text-vigyanics-cyan transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-vigyanics-cyan hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {/* Store toggle */}
            {!isStore ? (
              <button
                onClick={() => navigate("/store")}
                className="text-sm font-semibold text-vigyanics-cyan hover:text-vigyanics-blue transition-colors px-4 py-2 rounded-full border border-vigyanics-cyan/30 hover:bg-vigyanics-cyan hover:text-vigyanics-blue"
                data-testid="button-goto-store"
              >
                Store
              </button>
            ) : (
              <button
                onClick={() => navigate("/")}
                className="text-sm font-medium text-gray-600 hover:text-vigyanics-blue transition-colors"
                data-testid="button-goto-home"
              >
                Back to Website
              </button>
            )}

            {/* Cart button */}
            <button
              onClick={openCart}
              className="relative w-10 h-10 rounded-full bg-vigyanics-blue/5 border border-vigyanics-blue/10 hover:border-vigyanics-cyan/40 flex items-center justify-center transition-all duration-200 hover:bg-vigyanics-cyan/10"
              data-testid="button-cart"
            >
              <ShoppingCart className="w-4.5 h-4.5 text-vigyanics-blue" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-vigyanics-cyan text-vigyanics-blue text-xs font-bold flex items-center justify-center shadow"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <Button className="bg-vigyanics-blue hover:bg-vigyanics-cyan text-white border-none shadow-[0_4px_14px_0_rgba(11,31,58,0.39)] hover:shadow-[0_6px_20px_rgba(0,212,255,0.23)] hover:-translate-y-0.5 transition-all duration-200 rounded-full px-6">
              Book Free Trial
            </Button>
          </div>
        </div>

        {/* Mobile right side */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={openCart}
            className="relative w-9 h-9 rounded-full bg-vigyanics-blue/5 border border-vigyanics-blue/10 flex items-center justify-center"
            data-testid="button-cart-mobile"
          >
            <ShoppingCart className="w-4 h-4 text-vigyanics-blue" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-vigyanics-cyan text-vigyanics-blue text-xs font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button className="text-vigyanics-blue dark:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden absolute top-full left-0 w-full glass-panel border-t border-gray-200 dark:border-gray-800 shadow-xl"
          >
            <div className="p-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium p-2 text-gray-800 dark:text-gray-200 hover:text-vigyanics-cyan"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <hr className="border-gray-200" />
              <button
                onClick={() => { navigate(isStore ? "/" : "/store"); setMobileMenuOpen(false); }}
                className="text-lg font-semibold p-2 text-vigyanics-cyan text-left"
              >
                {isStore ? "Back to Website" : "Visit Store"}
              </button>
              <Button className="w-full mt-2 rounded-full bg-vigyanics-blue text-white">
                Book Free Trial
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
