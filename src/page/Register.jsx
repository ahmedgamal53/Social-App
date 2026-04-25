import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { IoIosLock } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../supabaseClient.js";
import { useAuth } from "../context/AuthProvider.jsx";
const Register = () => {
  const { setprofile, profile } = useAuth();
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [username, setusername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (data?.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        username: username,
      });
    }

    setprofile((prev) => ({
      ...prev,
      username: username,
    }));
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    } else {
      navigate("/home");
    }
    console.log(`UserName:${profile?.username}`);

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1f1f23] via-[#2a2a2e] to-[#1a1a1d]">
      <div className="w-[420px] bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/40">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              required
              onChange={(e) => setusername(e.target.value)}
              className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg pl-10 pr-3 py-2 outline-none transition"
            />
          </div>

          <div className="relative">
            <IoMdMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setemail(e.target.value)}
              className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg pl-10 pr-3 py-2 outline-none transition"
            />
          </div>

          <div className="relative">
            <IoIosLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setpassword(e.target.value)}
              className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg pl-10 pr-3 py-2 outline-none transition"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="mt-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
