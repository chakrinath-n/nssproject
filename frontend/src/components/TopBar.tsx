import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Users } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white/90 text-sm relative overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 via-sky-300 to-blue-400" />

      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
        {/* Left Side – NSS Badge */}
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="border-blue-300/40 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20 transition-colors font-medium px-3 py-1"
          >
            <Users className="w-3.5 h-3.5 mr-1.5" />
            National Service Scheme (NSS)
          </Badge>

          <span className="hidden md:inline-block text-white/60 text-xs">
            |
          </span>

          <span className="hidden md:inline-block text-white/70 text-xs tracking-wide">
            Not Me But You • Service to Society
          </span>
        </div>

        {/* Right Side – Contact Info */}
        <div className="hidden md:flex items-center gap-6 text-xs">
          <a
            href="tel:+918842300900"
            className="flex items-center gap-1.5 text-white/70 hover:text-sky-300 transition-colors group"
          >
            <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>+91-7702862555</span>
          </a>

          <a
            href="mailto:nss@jntuk.edu.in"
            className="flex items-center gap-1.5 text-white/70 hover:text-sky-300 transition-colors group"
          >
            <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>coordinator.nss@jntuk.edu.in</span>
          </a>

          <span className="flex items-center gap-1.5 text-white/70">
            <MapPin className="w-3.5 h-3.5" />
            <span>JNTUK, Kakinada</span>
          </span>
        </div>
      </div>
    </div>
  );
}
