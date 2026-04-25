import { useState } from "react";
import { IoMdMail } from "react-icons/io";
import { IoIosLock } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { BeatLoader } from "react-spinners";

const Login = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.error_description || error.message);
    } else {
      navigate("/home");
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1f1f23] via-[#2a2a2e] to-[#1a1a1d]">
      <div className="w-[420px] bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/40">
        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-8">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="relative">
            <IoMdMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full bg-white border border-gray-300 focus:border-blue-100 focus:ring-2 focus:ring-blue-200 rounded-lg pl-10 pr-3 py-2 outline-none transition"
            />
          </div>

          <div className="relative">
            <IoIosLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white border border-gray-300 focus:border-blue-100 focus:ring-2 focus:ring-blue-200 rounded-lg pl-10 pr-3 py-2 outline-none transition"
            />
          </div>

          <button
            disabled={loading}
            className="mt-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <button
          onClick={() => navigate("/register")}
          className="w-full border border-gray-300 hover:bg-gray-100 text-gray-800 rounded-lg py-2 transition"
        >
          Create account
        </button>
      </div>

      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm">
          <BeatLoader color="#3b82f6" size={12} />
        </div>
      )}
    </div>
  );
};

export default Login;
