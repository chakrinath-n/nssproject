import {
  GraduationCap,
  Globe2,
  Microscope,
  Building2,
  Users,
  Plane,
} from "lucide-react";

/* ---------------- NSS FEATURES DATA ---------------- */
const features = [
  {
    title: "Character Building & Leadership",
    description:
      "NSS nurtures leadership, discipline, and social responsibility among students through structured community service activities.",
    icon: GraduationCap,
    stats: "12,000+",
    statsLabel: "Volunteers",
    accent: "#CC0000",
  },
  {
    title: "Community Development",
    description:
      "Actively involved in rural development, cleanliness drives, health awareness, and social upliftment programs.",
    icon: Globe2,
    stats: "500+",
    statsLabel: "Villages",
    accent: "#4a90d9",
  },
  {
    title: "Health & Awareness Campaigns",
    description:
      "Organizing blood donation camps, medical camps, yoga programs, and awareness campaigns on public health issues.",
    icon: Microscope,
    stats: "1,000+",
    statsLabel: "Camps",
    accent: "#CC0000",
  },
  {
    title: "Institutional Support",
    description:
      "Strong coordination with universities, colleges, and government bodies for effective NSS program implementation.",
    icon: Building2,
    stats: "1,100+",
    statsLabel: "Units",
    accent: "#4a90d9",
  },
  {
    title: "Youth Engagement",
    description:
      "Empowering students to actively participate in nation-building activities with a spirit of service and unity.",
    icon: Users,
    stats: "36+",
    statsLabel: "Districts",
    accent: "#CC0000",
  },
  {
    title: "Special Camps & Outreach",
    description:
      "Annual special camps focusing on education, environment, digital literacy, and social welfare.",
    icon: Plane,
    stats: "300+",
    statsLabel: "Camps/Year",
    accent: "#4a90d9",
  },
];

/* ---------------- COMPONENT ---------------- */
export default function FeatureCards() {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "#001a3a", fontFamily: "'Georgia', serif" }}
    >
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "150px",
        }}
      />

      {/* Decorative circles */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 w-125 h-125 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #4a90d9 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 w-95 h-95 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #CC0000 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span
              className="inline-block text-xs font-bold tracking-[0.25em] uppercase mb-4 px-3 py-1 rounded-full"
              style={{ background: "#002a5c", color: "#4a90d9", border: "1px solid #4a90d9aa" }}
            >
              NSS @ JNTUK
            </span>
            <h2
              className="text-5xl md:text-6xl font-bold leading-tight"
              style={{ color: "#ffffff", letterSpacing: "-0.02em" }}
            >
              Serving Society,
              <br />
              <span style={{ color: "#CC0000" }}>Shaping Leaders.</span>
            </h2>
          </div>
          <p
            className="max-w-xs text-sm leading-relaxed md:text-right"
            style={{ color: "#888", fontFamily: "system-ui, sans-serif" }}
          >
            National Service Scheme empowers students to serve society and
            develop leadership qualities through meaningful action.
          </p>
        </div>

        {/* ── Divider ── */}
        <div className="w-full h-px mb-12" style={{ background: "linear-gradient(to right, transparent, #0a2a4a, transparent)" }} />

        {/* ── Card Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const isLast = i === features.length - 1;
            const isSecondLast = i === features.length - 2;

            return (
              <div
                key={feature.title}
                className="group relative p-8 cursor-default transition-all duration-300"
                style={{
                  borderRight: (i + 1) % 3 !== 0 ? "1px solid #0a2a4a" : "none",
                  borderBottom:
                    i < features.length - 3 || (features.length % 3 !== 0 && !isLast && !isSecondLast)
                      ? "1px solid #0a2a4a"
                      : "none",
                }}
              >
                {/* Hover fill */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `${feature.accent}08` }}
                />

                {/* Index number */}
                <span
                  className="absolute top-6 right-8 text-6xl font-black select-none pointer-events-none opacity-[0.04] group-hover:opacity-[0.08] transition-opacity"
                  style={{ color: feature.accent, lineHeight: 1, fontFamily: "system-ui" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div
                  className="relative z-10 mb-6 w-12 h-12 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${feature.accent}18`, border: `1px solid ${feature.accent}40` }}
                >
                  <Icon className="w-5 h-5" style={{ color: feature.accent }} />
                </div>

                {/* Title */}
                <h3
                  className="relative z-10 text-lg font-bold mb-3 transition-colors duration-300"
                  style={{
                    color: "#ffffff",
                    fontFamily: "'Georgia', serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="relative z-10 text-sm leading-relaxed mb-6"
                  style={{ color: "#666", fontFamily: "system-ui, sans-serif" }}
                >
                  {feature.description}
                </p>

                {/* Stats pill */}
                <div
                  className="relative z-10 inline-flex items-baseline gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: `${feature.accent}15`, border: `1px solid ${feature.accent}30` }}
                >
                  <span
                    className="text-xl font-black"
                    style={{ color: feature.accent, fontFamily: "system-ui, sans-serif", lineHeight: 1 }}
                  >
                    {feature.stats}
                  </span>
                  <span
                    className="text-xs uppercase tracking-wide"
                    style={{ color: `${feature.accent}bb`, fontFamily: "system-ui, sans-serif" }}
                  >
                    {feature.statsLabel}
                  </span>
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-8 h-0.5 w-0 group-hover:w-16 transition-all duration-500 rounded-full"
                  style={{ background: feature.accent }}
                />
              </div>
            );
          })}
        </div>

        {/* ── Divider ── */}
        <div className="w-full h-px mt-12 mb-10" style={{ background: "linear-gradient(to right, transparent, #0a2a4a, transparent)" }} />

        {/* ── NSS Motto Strip ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "#CC000020", border: "1px solid #CC000040" }}
          >
            <span style={{ color: "#CC0000", fontSize: "20px" }}>✦</span>
          </div>
          <div>
            <p
              className="text-xl font-bold tracking-wide"
              style={{ color: "#ffffff", fontFamily: "'Georgia', serif" }}
            >
              <em style={{ color: "#4a90d9" }}>Not Me,</em>{" "}
              <em style={{ color: "#CC0000" }}>But You</em>
            </p>
            <p
              className="text-xs uppercase tracking-[0.2em] mt-1"
              style={{ color: "#4a5568", fontFamily: "system-ui, sans-serif" }}
            >
              Official Motto of National Service Scheme
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "#4a90d920", border: "1px solid #4a90d940" }}
          >
            <span style={{ color: "#4a90d9", fontSize: "20px" }}>✦</span>
          </div>
        </div>
      </div>
    </section>
  );
}
