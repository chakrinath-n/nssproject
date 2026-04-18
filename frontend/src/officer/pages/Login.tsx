import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import type { FormEvent } from "react";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  // ✅ Already logged in → skip login page
  useEffect(() => {
    const token = localStorage.getItem("officer_token");
    if (token) navigate("/officer/dashboard", { replace: true });
  }, [navigate]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/officer/login", { email, password });
      localStorage.setItem("officer_token", res.data.token);
      navigate("/officer/dashboard", { replace: true }); // ✅ replace: true
    } catch {
      setError("Invalid Login");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">

        <h2 className="text-xl font-bold mb-6 text-center">
          Program Officer Login
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="border w-full p-2 mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border w-full p-2 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            type="submit"
            className="bg-green-700 text-white w-full py-2 rounded"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
}