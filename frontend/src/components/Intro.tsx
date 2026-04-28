import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ArrowRight, Quote, Target, Eye, Heart, BookOpen, Activity, Users, Award } from "lucide-react";

// ✅ Fixed swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

/* ---------------- TYPES ---------------- */

interface TeamMember {
  id: number;
  name: string;
  designation: string;
  image_url: string;
}

interface DashboardStats {
  units: number;
  volunteers: number;
  activities: number;
}

/* ---------------- NSS PILLARS ---------------- */

const pillars = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To develop socially responsible students through community service, leadership training, and nation-building activities under NSS.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To empower youth with a spirit of service, discipline, and dedication towards the development of society and the nation.",
  },
  {
    icon: Heart,
    title: "Our Values",
    description:
      "Selfless service, social responsibility, unity, integrity, discipline, and commitment to community welfare.",
  },
];

/* ---------------- QUICK LINKS ---------------- */

const quickLinks = [
  {
    icon: BookOpen,
    label: "NSS Digest",
    description: "View complete NSS statistics college-wise",
    route: "/nss-digest",
    bg: "bg-blue-900",
    hover: "hover:bg-blue-800",
  },
  {
    icon: Activity,
    label: "Activities",
    description: "Explore all NSS activities conducted",
    route: "/unit-activities",
    bg: "bg-green-700",
    hover: "hover:bg-green-600",
  },
  {
    icon: Users,
    label: "Volunteers",
    description: "Browse NSS volunteers across colleges",
    route: "/unit-volunteers",
    bg: "bg-orange-600",
    hover: "hover:bg-orange-500",
  },
  {
    icon: Award,
    label: "NSS Awards",
    description: "Recognizing excellence in NSS service",
    route: "/awards",
    bg: "bg-red-700",
    hover: "hover:bg-red-600",
  },
];

export default function Intro() {
  const navigate = useNavigate();

  const [aboutContent, setAboutContent] = useState<string>("");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    units: 0,
    volunteers: 0,
    activities: 0,
  });

  /* ================= FETCH ABOUT ================= */
  // ✅ Fixed ESLint error - moved fetch logic directly into useEffect
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get("/about");
        setAboutContent(res.data.about?.content || "");
        setTeam(res.data.team || []);
      } catch (err) {
        console.error("About fetch error:", err);
      }
    };

    const fetchStats = async () => {
      try {const res = await api.get("/officer/public-dashboard");
        setStats({
          units: res.data.units ?? res.data.nssUnits ?? 0,
          volunteers: res.data.volunteers ?? 0,
          activities: res.data.activities ?? 0,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchAbout();
    fetchStats();
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* ===== QUICK LINKS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {quickLinks.map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.route)}
              className={`${item.bg} ${item.hover} text-white rounded-xl p-6 cursor-pointer transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center gap-3`}
            >
              <div className="bg-white/20 p-3 rounded-full">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-wide">
                {item.label}
              </h3>
              <p className="text-xs text-white/70 leading-snug">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* HEADER */}
        <div className="text-center mb-16">
          <Badge className="border-blue-500/30 bg-blue-500/5 text-blue-800 mb-4">
            About NSS
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
            National Service Scheme
            <br />
            <span className="text-blue-600">
              Jawaharlal Nehru Technological University Kakinada
            </span>
          </h2>
        </div>

        {/* ===== DESCRIPTION + GLANCE ===== */}
        <div className="space-y-10 mb-24">

          {/* Description */}
          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-blue-500">
              <Quote className="absolute -left-3 -top-2 w-6 h-6 text-blue-500" />
              <p className="text-xl italic text-blue-950">
                "Not Me, But You – cultivating a spirit of selfless service and
                social responsibility among the youth."
              </p>
            </div>

            <div
              className="text-gray-600 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: aboutContent }}
            />

            <div className="flex gap-4 pt-4">
              <Button
                className="bg-blue-900 text-white"
                onClick={() => navigate("/unit-activities")}
              >
                Explore NSS Activities
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/nssunits")}
              >
                View NSS Units
              </Button>
            </div>
          </div>

          {/* ===== NSS AT A GLANCE ===== */}
          <div className="bg-white shadow-xl rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-blue-950 mb-8 text-center">
              NSS at a Glance
            </h3>
            <div className="grid grid-cols-3 gap-0">

              <div
                onClick={() => navigate("/nssunits")}
                className="text-center cursor-pointer hover:bg-blue-50 rounded-xl p-6 transition group"
              >
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">NSS Units</p>
                <p className="text-5xl font-bold text-blue-950 group-hover:text-blue-700 transition">
                  {stats.units}+
                </p>
              </div>

              <div
                onClick={() => navigate("/unit-volunteers")}
                className="text-center cursor-pointer hover:bg-orange-50 rounded-xl p-6 transition group border-x border-gray-100"
              >
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Volunteers</p>
                <p className="text-5xl font-bold text-blue-950 group-hover:text-orange-600 transition">
                  {stats.volunteers}+
                </p>
              </div>

              <div
                onClick={() => navigate("/unit-activities")}
                className="text-center cursor-pointer hover:bg-green-50 rounded-xl p-6 transition group"
              >
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Activities</p>
                <p className="text-5xl font-bold text-blue-950 group-hover:text-green-700 transition">
                  {stats.activities}+
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* ===== TEAM SECTION ===== */}
        {team.length > 0 && (
          <div className="bg-blue-950 py-12 rounded-2xl mb-24">
            <h3 className="text-2xl font-bold text-center text-white mb-8">
              JNTUK NSS Team
            </h3>
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={team.length > 3}
              spaceBetween={24}
              slidesPerView={4}
              breakpoints={{
                320: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="max-w-5xl mx-auto px-8"
            >
              {team.map((member) => (
                <SwiperSlide key={member.id}>
                  {/* ✅ Bigger image and name */}
                  <div className="flex flex-col items-center text-center py-4">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${member.image_url}`}
                      className="w-32 h-32 rounded-full object-cover border-4 border-red-600 shadow-lg"
                    />
                    <h4 className="mt-4 text-base font-bold text-white">
                      {member.name}
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">{member.designation}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* ===== PILLARS ===== */}
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="mb-4 p-3 bg-blue-900 rounded-lg inline-flex">
                <pillar.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-950 mb-2">
                {pillar.title}
              </h3>
              <p className="text-gray-600 text-sm">{pillar.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}