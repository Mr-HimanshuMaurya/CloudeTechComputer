import { ArrowUpRight } from "lucide-react";

export default function ServiceCard({ code, title, summary, detail, expanded = false }) {
  return (
    <div className="group relative card-border rounded-xl p-6 md:p-7 hover:border-signal/40 transition-colors duration-300 h-full flex flex-col">
      <div className="flex items-start justify-between mb-5">
        <span className="mono-label !text-muted-2 group-hover:!text-signal transition-colors">
          {code}
        </span>
        <ArrowUpRight
          size={18}
          className="text-muted-2 group-hover:text-signal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
        />
      </div>
      <h3 className="font-display text-lg font-semibold text-text mb-2.5">
        {title}
      </h3>
      <p className="text-sm text-muted leading-relaxed">{summary}</p>
      {expanded && (
        <p className="text-sm text-muted-2 leading-relaxed mt-3 pt-3 border-t border-line">
          {detail}
        </p>
      )}
    </div>
  );
}
