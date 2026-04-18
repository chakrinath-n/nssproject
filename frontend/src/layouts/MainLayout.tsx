import { Outlet, useLocation } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Intro from "../components/Intro";
import FeatureCards from "../components/FeatureCards";
import Footer from "../components/Footer";


export default function MainLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top announcement bar with accreditation and contact */}
      <TopBar />

      {/* Logo + Institute name with search and CTA */}
      <Header />

      {/* Main navigation menu with dropdowns */}
      <Navbar />


      {/* Page content or Home sections */}
      {isHomePage ? (
        <>
          {/* Hero section with stats and CTAs */}
          <Hero />

          {/* Introduction section with mission/vision */}
          <Intro />

          {/* Feature cards showcasing offerings */}
          <FeatureCards />
        </>
      ) : (
        <Outlet />
      )}

      {/* Footer with links and newsletter */}
      <Footer />
    </div>
  );
}
