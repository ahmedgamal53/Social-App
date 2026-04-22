import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ButtomLike from "./ButtomLike";
import { useAuth } from "../context/AuthProvider";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
dayjs.extend(relativeTime);

const Comments = ({
  setcommentmenue,
  post,
  setmnueLikes,
  mnueLikes,
  postLikes,
}) => {
  console.log("postLikesfromcomment", postLikes);
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [commint, setcommint] = useState("");
  return (
    <div
      onClick={() => setcommentmenue(null)}
      className="fixed inset-0 justify-center flex items-center z-50 bg-[#282830e8]/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
  bg-[#252728] w-xl relative md:w-2xl h-[600px]
  overflow-y-auto overflow-x-hidden rounded-md
  custom-scroll flex flex-col
"
      >
        <div className="flex py-3 z-50 top-0 sticky justify-between  bg-[#252728] gap-5 border-b-2 px-5  border-gray-400 pb-5">
          <IoCloseSharp
            onClick={() => setcommentmenue(null)}
            className="text-3xl bg-gray-600 rounded-4xl text-white cursor-pointer "
          />
          <span className="text-white text-2xl">
            {post.profiles?.username}'post
          </span>
          <div></div>
        </div>
        {/* image &username */}
        <div className="mt-5 mx-5">
          <div className="flex items-center gap-3">
            <div
              className=" cursor-pointer "
              onClick={() => {
                navigate(`/profile/${post.user_id}`);
                window.scrollTo({
                  behavior: "smooth",
                  top: 0,
                });
              }}
            >
              {post.profiles?.avatar_url ? (
                <img
                  src={post.profiles?.avatar_url}
                  className="size-15 object-cover mb-3 rounded-full w-[50px] h-[50px]   "
                />
              ) : (
                <IoPersonCircle className="text-3xl w-[50px] h-[50px]" />
              )}
            </div>
            <div>
              <h3
                className="hover:underline text-xl text-white duration-200 cursor-pointer "
                onClick={() => {
                  navigate(`/profile/${post.user_id}`);
                  window.scrollTo({
                    behavior: "smooth",
                    top: 0,
                  });
                }}
              >
                {post.profiles?.username}
              </h3>
              <span className="text-gray-300/60">
                {dayjs(post.created_at).fromNow()}
              </span>
            </div>
          </div>
        </div>
        {/* content */}
        <div className=" flex flex-col items-start">
          <div className="text-white px-3">{post.caption}</div>
          <div
            className={`grid  gap-2  mt-3 ${post.images?.length === 1 ? "grid-cols-1" : "grid-cols-2 px-2"}`}
          >
            {post.images?.map((url, index) => {
              const isVideo = url.match(/\.(mp4|webm|ogg)$/i);

              return (
                <div key={index} className="w-full ">
                  {isVideo ? (
                    <video
                      key={index}
                      src={url}
                      controls
                      className="rounded-md w-full"
                    />
                  ) : (
                    <img
                      key={index}
                      src={url}
                      loading="lazy"
                      className="rounded-md min-w-full "
                      alt=""
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* likes & Comment */}

        <div className="my-5">
          <div className="">
            {post.post_likes_count?.[0]?.count > 0 && (
              <div className="mx-2">
                <button
                  onClick={() => setmnueLikes(post.id)}
                  className="cursor-pointer flex items-center hover:bg-[#b0b3b8] rounded-md transition-all duration-300  gap-1 px-4 mt-3"
                >
                  <span className="text-gray-500 text-xl">
                    {post.post_likes_count?.[0]?.count}
                  </span>
                  <AiFillLike className="text-blue-500 text-2xl" />
                </button>
              </div>
            )}
          </div>

          <div className=" flex justify-around mt-5">
            <ButtomLike post={post} />

            <div className="flex items-center gap-2 cursor-pointer">
              <FaRegCommentAlt className="text-2xl" />
              <p>Comment</p>
            </div>
          </div>
        </div>

        {/* inputcommint */}
        <div className=" bg-[#3f3f3f]  py-5 px-3 rounded-md  sticky bottom-0 mt-auto z-100 flex gap-3 items-center">
          <img
            className="w-[50px] h-[50px] object-cover rounded-full"
            src={profile?.avatar_url}
            alt=""
          />
          <input
            placeholder="Write a comment..."
            className="bg-gray-300/20 w-full z-50 h-[50px] rounded-xl outline-none px-5 text-white"
            type="text"
            value={commint}
            onChange={(e) => setcommint(e.target.value)}
          />
          <div>
            <IoSendSharp className="text-blue-500 text-2xl" />
          </div>
        </div>

        {/* menuLikes */}
        <div>
          {mnueLikes == post.id && (
            <div
              onClick={() => setmnueLikes(null)}
              className="fixed z-50 bg-[#282830e8]/50 inset-0  "
            >
              <div className="flex justify-center items-center h-screen">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#252728] w-[450px] h-[350px] px-5 py-4 rounded-md "
                >
                  <div className="flex justify-between items-center">
                    <div className="flex  items-center justify-center gap-1">
                      <span className="text-gray-500 text-xl">
                        {post.post_likes_count?.[0]?.count}
                      </span>
                      <AiFillLike className="text-2xl  text-blue-500" />
                    </div>

                    <IoCloseSharp
                      onClick={() => setmnueLikes(null)}
                      className="text-3xl bg-gray-600 rounded-4xl text-white cursor-pointer "
                    />
                  </div>
                  <div>
                    {postLikes
                      ?.filter((likeid) => likeid.post_id === post.id)
                      .map((like, index) => {
                        return (
                          <div
                            key={index}
                            className="mt-10 flex items-center justify-between gap-3  overflow-y-auto"
                          >
                            {like.profiles?.avatar_url ? (
                              <img
                                onClick={() => {
                                  navigate(`/profile/${like.user_id}`);
                                  window.scrollTo({
                                    behavior: "smooth",
                                    top: 0,
                                  });
                                }}
                                src={like.profiles?.avatar_url}
                                className="size-15 cursor-pointer object-cover mb-3 rounded-full w-[50px] h-[50px]   "
                              />
                            ) : (
                              <IoPersonCircle className="text-3xl w-[60px] h-[60px]" />
                            )}{" "}
                            <span
                              onClick={() => {
                                navigate(`/profile/${like.user_id}`);
                                window.scrollTo({
                                  behavior: "smooth",
                                  top: 0,
                                });
                              }}
                              className="text-white hover:underline cursor-pointer duration-200"
                            >
                              {like.profiles.username}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
