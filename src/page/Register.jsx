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
    // if (error) {
    //   alert(error.message);
    //   setLoading(false);
    //   return;
    // }

    if (data?.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        username: username,
      });

      //   if (profileError) {
      //     console.error("Profile error:", profileError);
      //     alert(profileError.message);
      //     setLoading(false);
      //     return;
      //   }
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
    <div className="flex bg-linear-to-r from-[#484747d1] to-[#070707f4]  justify-center items-center h-screen">
      <div className="bg-white  p-5 rounded-md w-[500px]">
        <h2 className="font-semibold text-xl text-center">Create Account</h2>
        <div>
          <form
            onSubmit={handleRegister}
            action=""
            className="mt-5 flex flex-col gap-5 "
          >
            <div className="flex items-center relative">
              <span className="text-gray-500 left-2 text-xl absolute ">
                <FaUser />
              </span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                required
                onChange={(e) => setusername(e.target.value)}
                className="bg-white  w-full border-2 border-gray-400 rounded-md px-8 py-2 outline-none"
              />
            </div>
            <div className="flex items-center relative">
              <span className="text-gray-500 left-2 text-xl absolute ">
                <IoMdMail />
              </span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setemail(e.target.value)}
                className="bg-white  w-full border-2 border-gray-400 rounded-md px-8 py-2 outline-none"
              />
            </div>
            <div className="flex items-center relative">
              <span className="text-gray-500 left-2 text-xl absolute ">
                <IoIosLock />
              </span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setpassword(e.target.value)}
                className="bg-white  w-full border-2 border-gray-400 rounded-md px-8 py-2 outline-none"
              />
            </div>
            <div>
              <button
                disabled={loading}
                type="submit"
                className="bg-blue-400 disabled:cursor-no-drop text-white mt-5 rounded-md w-full px-3 py-2 cursor-pointer hover:bg-blue-500 transition-all duration-400 outline-none active:scale-95"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>
          <div className="text-center mt-5">
            <p>
              Aleardy have an account?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-blue-500 cursor-pointer text-[18px] "
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
