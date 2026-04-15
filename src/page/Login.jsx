import { useState } from "react";
import { IoMdMail } from "react-icons/io";
import { IoIosLock } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { BeatLoader } from "react-spinners";
import Home from "./Home.jsx";

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
    <div>
      <div className="flex bg-linear-to-r from-[#484747d1] to-[#070707f4] justify-center items-center h-screen ">
        <div className="bg-white p-5 rounded-md w-[500px] ">
          <h1 className="font-semibold text-center text-2xl mb-10">Sign In</h1>

          <div>
            <form
              onSubmit={handleLogin}
              action=""
              className="flex flex-col gap-5 "
            >
              <div className="flex  items-center relative ">
                <span className="text-gray-500 left-2 text-xl absolute">
                  <IoMdMail />
                </span>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  className="bg-white w-full border-2 border-gray-400 rounded-md px-8 py-2 outline-none"
                ></input>
              </div>
              <div className="flex items-center relative ">
                <span className="text-gray-500 left-2 text-xl absolute">
                  <IoIosLock />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  placeholder="password"
                  className="bg-white w-full border-2 border-gray-400 rounded-md px-8 py-2 outline-none"
                />
              </div>
              <div>
                <button
                  disabled={loading}
                  className="bg-blue-400 text-white mt-5 rounded-md w-full px-3 py-2 cursor-pointer disabled:cursor-no-drop hover:bg-blue-500 transition-all duration-400 outline-none active:scale-95"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
                {/* {error && <p className="text-red-500 text-sm">{error} </p>} */}
              </div>
            </form>
          </div>
          <div className="text-center mt-5 text-2xl">
            <p className="">--Or--</p>
          </div>
          <div className=" flex felx-col justify-center ">
            <button
              onClick={() => navigate("/register")}
              className="mt-5 bg-blue-500 text-white px-6 py-3 cursor-pointer rounded-md "
            >
              Register
            </button>
          </div>
        </div>
        {loading && (
          <div className="fixed flex justify-center items-center h-screen inset-0 bg-black/10">
            <div className="">
              <BeatLoader color="#3498db" size={15} />
            </div>
          </div>
        )}
      </div>
      <Home />
    </div>
  );
};

export default Login;
