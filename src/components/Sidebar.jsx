import { IoPersonCircle } from "react-icons/io5";
import logo from "../assets/ChatGPT Image Feb 3, 2026, 09_56_57 PM.png";
import { NavLink } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";

import { RiNotificationFill } from "react-icons/ri";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "../supabaseClient.js";
import { useNotifications } from "../api/posts/Notifications.jsx";

const Sidebar = () => {
  const { data: notifications } = useNotifications();
  const unreadCount = notifications?.filter((n) => !n.is_read).length;
  const { profile, loading } = useAuth();

  console.log("INSIDE COMPONENT:", profile);
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  return (
    <div className="fixed">
      <div className="flex justify-center   items-center  border-r-2 border-r-gray-400   ">
        <img src={logo} className="size-17" />
        <h2 className="font-semibold text-xl">Social App</h2>
      </div>
      <div className="bg-blue-500/90 shadow-2xl  h-screen w-[200px]">
        <div className="pt-5 px-5">
          <div className="flex items-center gap-3  ">
            {profile?.avatar_url ? (
              <img
                src={profile?.avatar_url}
                className="size-15 object-cover mb-3 rounded-full   "
              />
            ) : (
              <IoPersonCircle className="text-3xl" />
            )}
            {!loading ? (
              <span className="text-white">
                {/* {session?.user?.user_metadata?.username} */}
                {profile?.username}
              </span>
            ) : (
              <span>username</span>
            )}{" "}
          </div>
          <nav className="mt-5 flex flex-col gap-5">
            <ul>
              <NavLink
                to={"/home"}
                className={({ isActive }) =>
                  `${isActive ? "bg-blue-300" : null} flex items-center gap-3 text-white text-xl rounded-md px-2 py-1`
                }
              >
                <IoMdHome />
                <li>Home</li>
              </NavLink>
            </ul>
            <ul>
              <NavLink
                to={`/profile/${profile?.id}`}
                className={({ isActive }) =>
                  `${isActive ? "bg-blue-300" : null} flex items-center gap-3 text-white text-xl rounded-md px-2 py-1`
                }
              >
                <IoPerson />
                <li>profile</li>
              </NavLink>
            </ul>
            <ul>
              <NavLink
                to={"/notifications"}
                className={({ isActive }) =>
                  `${isActive ? "bg-blue-300" : null} flex items-center gap-3 text-white text-xl rounded-md px-2 py-1`
                }
              >
                <div className="relative">
                  <RiNotificationFill />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <li>Notifications</li>
              </NavLink>
            </ul>
            <button
              onClick={handleLogout}
              className={` cursor-pointer flex items-center gap-3 text-white text-xl rounded-md px-2 py-1`}
            >
              <FiLogOut />
              <p>log out</p>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
