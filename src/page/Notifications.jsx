import React from "react";
import { useMarkAsRead, useNotifications } from "../api/posts/Notifications";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
dayjs.extend(relativeTime);
const Notifications = () => {
  const { data: notifications } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-3 p-5">
      <div
        onClick={() => navigate(-1)}
        className="md:hidden bg-white/50 backdrop-blur-2xl border border-white/20 rounded-xl shadow-xl px-5 py-2 text-xl w-fit cursor-pointer duration-200 text-slate-700 hover:text-slate-800"
      >
        <FaArrowLeft />
      </div>
      {notifications?.length > 0 ? (
        notifications?.map((notif) => (
          <div
            onClick={() => {
              markAsRead(notif.id);
              navigate(`/profile/${notif.user_id}`);
            }}
            key={notif.id}
            className={`
        flex items-center gap-4 cursor-pointer
        p-4 rounded-xl transition-all duration-300

        backdrop-blur-md 

       ${
         !notif.is_read
           ? "bg-blue-500/15   shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
           : "bg-white/50 hover:bg-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
       }
      `}
          >
            {notif.sender?.avatar_url ? (
              <img
                src={notif.sender?.avatar_url}
                className="w-[48px] h-[48px] rounded-full object-cover border border-white/20"
              />
            ) : (
              <IoPersonCircle className="w-[48px] h-[48px] text-gray-400" />
            )}

            {/* text */}
            <div className="flex flex-col text-gray-900">
              <span className="text-sm">
                <span className="font-semibold text-black">
                  {notif.sender?.username}
                </span>{" "}
                {notif.type === "like"
                  ? "liked your post"
                  : "commented on your post"}
              </span>

              <span className="text-gray-600 text-xs mt-1">
                {dayjs(notif.created_at).fromNow()}
              </span>
            </div>

            {!notif.is_read && (
              <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
            )}
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center mt-10 text-gray-500">
          <div>No Notifications available</div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
