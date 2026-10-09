import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, company } from "../data/content";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-base/85 backdrop-blur-md border-b border-line"
          : "bg-transparent"
      }`}
    >
      <nav className="container-px flex items-center justify-between h-18 py-4">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setOpen(false)}
        >
          <img
            src="/shortlogowithoutbg.png"
            alt="CloudTech Hosting"
            className="w-10 h-10 object-contain"
          />

          <span className="font-display font-semibold text-[1.05rem] tracking-tight text-text">
            {company.name}
          </span>
        </NavLink>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "text-signal" : "text-muted hover:text-text"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className="ml-3 px-4 py-2 rounded-md text-sm font-semibold bg-signal text-base hover:bg-white transition-colors"
          >
            Get a quote
          </NavLink>
        </div>

        <button
          className="md:hidden text-text p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-base border-b border-line"
          >
            <div className="container-px flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-2 py-3 text-base font-medium border-b border-line/60 ${
                      isActive ? "text-signal" : "text-text"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-3 px-4 py-3 rounded-md text-sm font-semibold bg-signal text-base text-center"
              >
                Get a quote
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
