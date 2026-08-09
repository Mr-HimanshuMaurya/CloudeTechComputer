import { motion } from "framer-motion";

export function PageShell({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 pt-32 pb-24"
    >
      {children}
    </motion.main>
  );
}

export function FadeShell({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-6 h-px bg-signal" />
      <span className="mono-label">{children}</span>
    </div>
  );
}
