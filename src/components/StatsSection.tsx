export default function StatsSection() {
  const stats = [
    {
      value: "25,000+",
      label: "Teachers Registered",
      description: "Qualified educators across Kerala and South India",
    },
    {
      value: "1,200+",
      label: "Institutions",
      description: "Schools, junior colleges & educational trusts",
    },
    {
      value: "8,500+",
      label: "Active Opportunities",
      description: "Full-time, part-time & specialized teaching roles",
    },
    {
      value: "92%",
      label: "Successful Matches",
      description: "Candidates placed within 30 days of profile creation",
    },
  ];

  return (
    <section className="section-padding bg-xyroots-dark text-white relative overflow-hidden" aria-label="Key statistics">
      {/* Background organic glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#00a264]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-xyroots-yellow/10 organic-blob blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-xyroots-yellow mb-4">
            Platform Impact
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Numbers That Define Better Hiring.
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Real metrics from thousands of successful classroom placements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm card-hover flex flex-col justify-between"
            >
              <div>
                <div className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-xyroots-yellow mb-3 leading-none">
                  {stat.value}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{stat.label}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
