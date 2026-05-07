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
import { useInsertComment } from "../api/posts/Comment";
import { useInsertNotification } from "../api/posts/Notifications";
import { IoPersonCircle } from "react-icons/io5";

dayjs.extend(relativeTime);

const Comments = ({
  setcommentmenue,
  post,
  setmnueLikes,
  mnueLikes,
  postLikes,
  usecomment,
}) => {
  console.log("postLikesfromcomment", postLikes);

  console.log("commit", usecomment);
  console.log("commit length", post.comments?.[0]?.count);

  const { mutate: insertcomment } = useInsertComment();

  const { mutate: insertNotification } = useInsertNotification();

  const { profile, session } = useAuth();
  const navigate = useNavigate();
  const [commint, setcommint] = useState("");

  const handelsend = () => {
    if (!commint.trim()) return;
    try {
      insertcomment({ content: commint, post_id: post.id });
      if (post.user_id !== session.user.id) {
        insertNotification({
          user_id: post.user_id,
          sender_id: session.user.id,
          post_id: post.id,
          type: "comment",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setcommint("");
    }
  };
  return (
    <div
      onClick={() => setcommentmenue(null)}
      className="fixed inset-0 justify-center flex items-center z-50 bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
       relative md:w-2xl  w-xl h-[600px]
      overflow-y-auto overflow-x-hidden rounded-2xl
      custom-scroll flex flex-col

      bg-[#1e1e1e]
      border border-gray-700
      shadow-2xl
    "
      >
        {/* header */}
        <div className="flex py-3 sticky top-0 justify-between gap-5 px-5 border-b border-gray-700 bg-[#1e1e1e]">
          <IoCloseSharp
            onClick={() => setcommentmenue(null)}
            className="text-3xl bg-gray-700 hover:bg-gray-600 rounded-full text-white cursor-pointer p-1 transition"
          />
          <span className="text-white text-2xl">
            {post.profiles?.username}'s post
          </span>
          <div></div>
        </div>

        {/* user */}
        <div className="mt-5 mx-5">
          <div className="flex items-center gap-3">
            <div
              className="cursor-pointer"
              onClick={() => {
                navigate(`/profile/${post.user_id}`);
                window.scrollTo({ behavior: "smooth", top: 0 });
              }}
            >
              {post.profiles?.avatar_url ? (
                <img
                  src={post.profiles?.avatar_url}
                  className="object-cover mb-3 rounded-full w-[50px] h-[50px]"
                />
              ) : (
                <IoPersonCircle className="text-3xl w-[50px] h-[50px]" />
              )}
            </div>
            <div>
              <h3
                className="hover:underline text-xl text-white cursor-pointer"
                onClick={() => {
                  navigate(`/profile/${post.user_id}`);
                  window.scrollTo({ behavior: "smooth", top: 0 });
                }}
              >
                {post.profiles?.username}
              </h3>
              <span className="text-gray-400">
                {dayjs(post.created_at).fromNow()}
              </span>
            </div>
          </div>
        </div>

        {/* content */}
        <div className="flex flex-col items-start">
          <div className="text-white px-3">{post.caption}</div>

          <div
            className={`grid gap-2 mt-3 ${
              post.images?.length === 1 ? "grid-cols-1" : "grid-cols-2 px-2"
            }`}
          >
            {post.images?.map((url, index) => {
              const isVideo = url.match(/\.(mp4|webm|ogg)$/i);

              return (
                <div
                  key={index}
                  className=" flex justify-center items-center  md:w-2xl mx-auto"
                >
                  {isVideo ? (
                    <video src={url} controls className="rounded-xl w-full" />
                  ) : (
                    <img
                      src={url}
                      loading="lazy"
                      className="rounded-xl min-w-full"
                      alt=""
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* likes */}
        <div className="my-5">
          <div className="flex justify-between px-5">
            {post.post_likes_count?.[0]?.count > 0 && (
              <div className="mx-2">
                <button
                  onClick={() => setmnueLikes(post.id)}
                  className="cursor-pointer flex items-center hover:bg-gray-700 rounded-lg transition gap-1 px-4 py-1 mt-3"
                >
                  <span className="text-gray-300 text-lg">
                    {post.post_likes_count?.[0]?.count}
                  </span>
                  <AiFillLike className="text-blue-500 text-xl" />
                </button>
              </div>
            )}
            <div>{post.comments.count > 0 && <div>ahmed</div>}</div>
          </div>

          <div className="flex justify-around mt-5">
            <ButtomLike post={post} />

            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 px-4 py-2 rounded-lg transition">
              <FaRegCommentAlt className="text-xl text-white" />
              <p className="text-white">Comment</p>
            </div>
          </div>
        </div>

        {/* comments */}
        <div>
          {usecomment
            .filter((comments) => comments.post_id === post.id)
            .map((comment, index) => {
              return (
                <div className="m-5" key={index}>
                  <div className="flex gap-5">
                    {comment.profiles?.avatar_url ? (
                      <img
                        onClick={() => {
                          navigate(`/profile/${comment.user_id}`);
                          window.scrollTo({ behavior: "smooth", top: 0 });
                        }}
                        src={comment.profiles?.avatar_url}
                        className="cursor-pointer object-cover rounded-full w-[50px] h-[50px]"
                      />
                    ) : (
                      <IoPersonCircle className="text-3xl w-[60px] h-[60px]" />
                    )}

                    <div className="flex flex-col bg-gray-800 rounded-xl px-4 py-2">
                      <span
                        onClick={() => {
                          navigate(`/profile/${comment.user_id}`);
                          window.scrollTo({ behavior: "smooth", top: 0 });
                        }}
                        className="text-white hover:underline cursor-pointer"
                      >
                        {comment.profiles.username}
                      </span>
                      <span className="text-white text-lg">
                        {comment.content}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* input */}
        <div className="bg-[#1e1e1e] border-t border-gray-700 py-4 px-3 sticky bottom-0 mt-auto flex gap-3 items-center">
          <img
            className="w-[45px] h-[45px] object-cover rounded-full"
            src={profile?.avatar_url}
            alt=""
          />

          <input
            placeholder="Write a comment..."
            className="bg-gray-800 w-full h-[45px] rounded-xl outline-none px-4 text-white placeholder:text-gray-400"
            type="text"
            value={commint}
            onChange={(e) => setcommint(e.target.value)}
          />

          <button
            onClick={handelsend}
            disabled={!commint.trim()}
            className="text-blue-500 text-xl cursor-pointer disabled:cursor-no-drop disabled:text-blue-200"
          >
            <IoSendSharp />
          </button>
        </div>

        {/* likes modal */}
        {mnueLikes == post.id && (
          <div
            onClick={() => setmnueLikes(null)}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#2a2a2a] w-[420px] max-h-[350px] overflow-y-auto rounded-2xl p-5 shadow-2xl border border-gray-700"
            >
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 text-lg">
                    {post.post_likes_count?.[0]?.count}
                  </span>
                  <AiFillLike className="text-blue-500 text-xl" />
                </div>

                <IoCloseSharp
                  onClick={() => setmnueLikes(null)}
                  className="text-2xl bg-gray-700 hover:bg-gray-600 rounded-full text-white cursor-pointer p-1"
                />
              </div>

              {postLikes
                ?.filter((likeid) => likeid.post_id === post.id)
                .map((like, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded-lg"
                      onClick={() => {
                        navigate(`/profile/${like.user_id}`);
                        window.scrollTo({ behavior: "smooth", top: 0 });
                      }}
                    >
                      {like.profiles?.avatar_url ? (
                        <img
                          src={like.profiles?.avatar_url}
                          className="w-[40px] h-[40px] rounded-full object-cover"
                        />
                      ) : (
                        <IoPersonCircle className="text-3xl" />
                      )}

                      <span className="text-white">
                        {like.profiles.username}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
