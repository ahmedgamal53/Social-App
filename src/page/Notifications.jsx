import React from "react";
import { useMarkAsRead, useNotifications } from "../api/posts/Notifications";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
dayjs.extend(relativeTime);
const Notifications = () => {
  const { data: notifications } = useNotifications();
  console.log("notifications", notifications);
  const { mutate: markAsRead } = useMarkAsRead();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-3 p-5">
      {notifications?.map((notif) => (
        <div
          onClick={() => {
            markAsRead(notif.id);
            navigate(`/profile/${notif.user_id}`);
          }}
          key={notif.id}
          className={`flex items-center cursor-pointer gap-3 p-3 rounded-md ${!notif.is_read ? "bg-blue-500/20" : "bg-[#252728]"}`}
        >
          <img
            src={notif.sender?.avatar_url}
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
          <div className="text-white">
            <span className="font-bold">{notif.sender?.username}</span>
            {notif.type === "like"
              ? " liked your post"
              : " commented on your post"}
            <div className="text-gray-400 text-sm">
              {dayjs(notif.created_at).fromNow()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
