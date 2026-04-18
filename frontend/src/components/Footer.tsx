import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Activities", href: "/activities" },
  { label: "NSS Units", href: "/nssunits" },
  { label: "Notifications", href: "/notifications" },
  { label: "Reports", href: "/reports" },
  { label: "About NSS", href: "/intro" },
  { label: "Contact", href: "/contact" },
  { label: "Gallery", href: "/gallery" },
];

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/officialjntuk" },
  { icon: Twitter, href: "https://twitter.com/jntukofficial" }, // fixed
  { icon: Linkedin, href: "https://www.linkedin.com/school/jntuk/" }, // fixed
  { icon: Youtube, href: "https://www.youtube.com/@JNTUK-Official" }, // keep or update if needed
];

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full border border-[#d4a853] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#d4a853]" />
              </div>
              <div>
                <h4 className="font-bold">NSS – JNTUK</h4>
                <p className="text-xs text-white/50">National Service Scheme</p>
              </div>
            </div>
            <p className="text-white/50 text-xs leading-relaxed mb-4">
              Developing social responsibility and leadership through community service at JNTU Kakinada.
            </p>
            <div className="space-y-2 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-[#d4a853]" />
                <span>NSS Cell, JNTUK Campus, Kakinada – 533003</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-[#d4a853]" />
                <span>0884-2357898</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-[#d4a853]" />
                <span>jntuknsscell@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 border-b border-white/10 pb-2">
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-xs text-white/60 hover:text-[#d4a853] transition"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-sm mb-4 border-b border-white/10 pb-2">
              Follow Us
            </h4>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-[#d4a853] hover:text-[#d4a853] transition"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-xs text-white/40">
          © 2026 JNTUK – National Service Scheme. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
