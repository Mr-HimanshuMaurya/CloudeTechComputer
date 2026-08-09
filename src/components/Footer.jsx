import { NavLink } from "react-router-dom";
import { Cpu, Mail, Phone, MapPin } from "lucide-react";
import { company, navLinks, services } from "../data/content";

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-surface">
      <div className="container-px py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-base border border-line">
              <Cpu size={18} className="text-signal" strokeWidth={1.75} />
            </span>
            <span className="font-display font-semibold text-text">{company.name}</span>
          </div>
          <p className="text-sm text-muted leading-relaxed max-w-xs">
            {company.tagline}
          </p>
        </div>

        <div>
          <p className="mono-label mb-4">Navigate</p>
          <ul className="space-y-2.5">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className="text-sm text-muted hover:text-signal transition-colors">
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mono-label mb-4">Services</p>
          <ul className="space-y-2.5">
            {services.slice(0, 5).map((s) => (
              <li key={s.code} className="text-sm text-muted">{s.title}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mono-label mb-4">Contact</p>
          <ul className="space-y-3">
            <li className="flex items-center gap-2.5 text-sm text-muted">
              <Mail size={15} className="text-signal shrink-0" /> {company.email}
            </li>
            <li className="flex items-center gap-2.5 text-sm text-muted">
              <Phone size={15} className="text-signal shrink-0" /> {company.phone}
            </li>
            <li className="flex items-center gap-2.5 text-sm text-muted">
              <MapPin size={15} className="text-signal shrink-0" /> {company.location}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-px py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-2 font-mono">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-2 font-mono">Built in-house by Team CloudTech</p>
        </div>
      </div>
    </footer>
  );
}
