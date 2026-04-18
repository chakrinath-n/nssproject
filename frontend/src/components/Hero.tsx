import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <section className="relative min-h-[650px] md:min-h-[750px] overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-500 to-blue-500" />

      {/* Logo Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[450px] h-[450px] bg-blue-400/10 rounded-full blur-3xl" />
        <img
          src="/nss-logo.png"
          alt="JNTUK National Service Scheme"
          className="w-[600px] md:w-[620px] opacity-25 object-contain"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl">

          <Badge
            variant="outline"
            className="border-blue-300/40 bg-blue-400/10 text-blue-200 mb-6 px-4 py-1.5 text-sm font-medium"
          >
            National Service Scheme – JNTUK
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
            Not Me, But You
            <br />
            <span className="text-blue-300">Serving Society</span> Through NSS
          </h1>

          <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-10 max-w-2xl">
            The National Service Scheme (NSS) at Jawaharlal Nehru Technological
            University Kakinada empowers students to engage in community
            service, social responsibility, and nation building.
          </p>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-blue-400 animate-bounce" />
        </div>
      </div>

    </section>
  );
}