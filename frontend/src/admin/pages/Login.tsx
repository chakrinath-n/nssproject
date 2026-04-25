import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const VITE_BASE_URL = import.meta.env.VITE_API_URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${VITE_BASE_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("admin", JSON.stringify(response.data.admin));
      toast.success("Login successful!");
      navigate("/admin");
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Toaster position="top-right" />

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-navy via-navy-light to-navy overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center border border-gold/30 shadow-lg">
              <GraduationCap className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-display text-white tracking-tight">
                JNTUK
              </h1>
              <p className="text-gold/80 text-sm tracking-widest uppercase">
                University
              </p>
            </div>
          </div>

          <h2 className="text-5xl font-display text-white leading-tight mb-6">
            Admin <br />
            <span className="text-gold">Portal</span>
          </h2>

          <p className="text-slate-300 text-lg max-w-md mb-10">
            Manage Activities, NssUnits, Reports
            from a unified dashboard.
          </p>

          <div className="flex flex-wrap gap-3">
            {["", "", ""].map(
              (feature) => (
                <span
                  key={feature}
                  className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-200 text-sm shadow-sm"
                >
                  {feature}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-ivory via-white to-slate-50">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-slate-200">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h1 className="text-xl font-display text-navy">JNTUK</h1>
              <p className="text-slate-500 text-xs uppercase">
                Admin Portal
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-display text-navy tracking-tight mb-2">
              Welcome back
            </h3>
            <p className="text-slate-500">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-navy/80 block mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="admin@jntuk.edu.in"
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white text-navy placeholder:text-slate-400 focus:border-gold focus:ring-4 focus:ring-gold/20 shadow-sm transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-navy/80 block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 bg-white text-navy placeholder:text-slate-400 focus:border-gold focus:ring-4 focus:ring-gold/20 shadow-sm transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-navy to-navy-light text-white font-semibold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-100 disabled:opacity-70 transition-all shadow-lg group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Need help?{" "}
            <a
              href="mailto:support@jntuk.edu.in"
              className="text-gold hover:underline"
            >
              Contact IT Support
            </a>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-slate-500 hover:text-navy inline-flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to main site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}