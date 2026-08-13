export default function TrustLogos() {
  const institutions = [
    "Northstar Academy",
    "Greenfield International",
    "BrightPath Education",
    "Oakwood Academy",
  ];

  return (
    <section className="pt-28 pb-12 lg:pt-36 lg:pb-16 bg-gradient-to-b from-[#f0ebe6] to-[#f5f7f6]" aria-label="Trusted institutions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-xyroots-muted mb-8">
          Trusted by educators and growing institutions
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-14">
          {institutions.map((name) => (
            <div
              key={name}
              className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-xyroots-dark/10 flex items-center justify-center">
                <span className="text-xs font-bold text-black/60">
                  {name.split(" ").map((w) => w[0]).join("")}
                </span>
              </div>
              <span className="text-sm font-semibold text-black/60 hidden sm:block">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
