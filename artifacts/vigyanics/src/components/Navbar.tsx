import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Atom } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Programs", href: "#programs" },
    { name: "Schools & ATL", href: "#schools" },
    { name: "Projects", href: "#projects" },
    { name: "Success Stories", href: "#success" },
    { name: "About Us", href: "#about" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass-panel py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-vigyanics-blue flex items-center justify-center text-white relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(0,212,255,0.6)] transition-all duration-300">
            <Atom className="w-6 h-6 animate-pulse-glow" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-vigyanics-blue dark:text-white">Vigyanics</span>
        </a>

        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="text-sm font-medium text-gray-700 hover:text-vigyanics-cyan dark:text-gray-300 dark:hover:text-vigyanics-cyan transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-vigyanics-cyan hover:after:w-full after:transition-all after:duration-300">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <Button className="bg-vigyanics-blue hover:bg-vigyanics-cyan text-white border-none shadow-[0_4px_14px_0_rgba(11,31,58,0.39)] hover:shadow-[0_6px_20px_rgba(0,212,255,0.23)] hover:-translate-y-0.5 transition-all duration-200 rounded-full px-6">
            Book Free Trial
          </Button>
        </div>

        <button className="lg:hidden text-vigyanics-blue dark:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full glass-panel border-t border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-4 shadow-xl">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-lg font-medium p-2 text-gray-800 dark:text-gray-200 hover:text-vigyanics-cyan dark:hover:text-vigyanics-cyan"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Button className="w-full mt-2 rounded-full bg-vigyanics-blue text-white">
            Book Free Trial
          </Button>
        </div>
      )}
    </nav>
  );
}
