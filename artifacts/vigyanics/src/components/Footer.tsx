import { Atom } from "lucide-react";

const footerLinks = {
  Programs: ["STEM Foundations", "Robotics", "AI & Future Tech", "Innovation Labs"],
  Schools: ["ATL Lab Setup", "Teacher Training", "Curriculum Integration", "Competition Support"],
  "ATL Labs": ["About ATL", "Compliance Support", "Equipment", "Events Calendar"],
  Resources: ["Student Blog", "Project Library", "Research Papers", "Competition Calendar"],
  About: ["Our Story", "Team", "Mentors", "Careers"],
  Contact: ["Book Trial", "School Inquiry", "WhatsApp", "Email Us"],
};

export default function Footer() {
  return (
    <footer className="relative bg-vigyanics-blue overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>
      <div className="absolute top-0 left-0 w-[400px] h-[300px] bg-vigyanics-cyan/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 pt-16 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-10 pb-12 border-b border-white/10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <a href="#home" className="flex items-center gap-2 group mb-5">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-vigyanics-cyan/30 flex items-center justify-center text-vigyanics-cyan group-hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all duration-300">
                <Atom className="w-6 h-6" />
              </div>
              <span className="font-display font-bold text-xl text-white">Vigyanics</span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-2 max-w-xs font-semibold text-vigyanics-cyan/80 italic">
              Where Curiosity Meets Creation
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              We don't just sell. We teach, guide and build with you.
            </p>
            <div className="flex gap-3">
              {[
                { label: "In", href: "#" },
                { label: "Tw", href: "#" },
                { label: "Yt", href: "#" },
                { label: "Ig", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-gray-400 hover:text-vigyanics-cyan hover:border-vigyanics-cyan/40 hover:bg-vigyanics-cyan/10 transition-all duration-200 text-xs font-bold"
                  data-testid={`link-social-${s.label.toLowerCase()}`}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1">
              <h4 className="font-display font-semibold text-white text-sm mb-4 tracking-wide">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 text-sm hover:text-vigyanics-cyan transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Vigyanics. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-vigyanics-cyan transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-vigyanics-cyan transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-vigyanics-cyan transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
