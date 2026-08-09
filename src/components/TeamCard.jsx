export default function TeamCard({ name, role, expertise, bio, initials }) {
  return (
    <div className="card-border rounded-xl p-6 md:p-7 h-full flex flex-col hover:border-signal/40 transition-colors duration-300">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full bg-surface-2 border border-line flex items-center justify-center font-display font-semibold text-signal text-lg shrink-0">
          {initials}
        </div>
        <div>
          <h3 className="font-display font-semibold text-text leading-tight">{name}</h3>
          <p className="text-sm text-signal">{role}</p>
        </div>
      </div>
      <p className="mono-label !text-muted-2 mb-2.5">{expertise}</p>
      <p className="text-sm text-muted leading-relaxed">{bio}</p>
    </div>
  );
}
