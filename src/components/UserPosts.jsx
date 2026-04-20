import { IoPerson } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCommentAlt } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { IoPersonCircle } from "react-icons/io5";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ButtomLike from "./ButtomLike.jsx";
import { useMemo, useState } from "react";
import { usePostLikes } from "../api/posts/Posts.jsx";
import { useNavigate } from "react-router-dom";
dayjs.extend(relativeTime);

const UserPosts = ({ posts }) => {
  const navigate = useNavigate();
  const postId = useMemo(() => posts?.map((post) => post.id), [posts]);
  const { data: postLikes } = usePostLikes(postId);
  const [mnueLikes, setmnueLikes] = useState(null);

  console.log("postLikes", postLikes);

  console.log(
    "postLikesFilter",
    postLikes
      ?.filter((likeid) => likeid.post_id === mnueLikes)
      .map((like) => like.profiles.username),
  );
  console.log("mnueLikes", mnueLikes);

  return (
    <div>
      <div className="w-xl">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="mt-5 bg-white rounded-md px-3 py-3 shadow-2xl"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {post.profiles?.avatar_url ? (
                  <img
                    src={post.profiles?.avatar_url}
                    className="size-15 object-cover mb-3 rounded-full w-[50px] h-[50px]   "
                  />
                ) : (
                  <IoPersonCircle className="text-3xl w-[50px] h-[50px]" />
                )}{" "}
                <div>
                  <h3>{post.profiles?.username}</h3>
                  <span>{dayjs(post.created_at).fromNow()}</span>
                </div>
              </div>
              <div>
                <button>
                  <BsThreeDots className="text-3xl cursor-pointer" />
                </button>
              </div>
            </div>
            <div className="mt-5 px-4 flex flex-col gap-5">
              <p>{post.caption}</p>
              <div>
                <div
                  className={`grid  gap-3 px-5 mt-3 ${post.images?.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
                >
                  {post.images?.map((url, index) => {
                    const isVideo = url.match(/\.(mp4|webm|ogg)$/i);

                    return (
                      <div key={index} className="w-full">
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
                            className="rounded-md min-w-full"
                            alt=""
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* likes & Comment */}

                <div className="">
                  {post.post_likes_count?.[0]?.count > 0 && (
                    <div>
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
                          ?.filter((likeid) => likeid.post_id === mnueLikes)
                          .map((like, index) => {
                            return (
                              <div
                                key={index}
                                className="mt-10 flex items-center justify-between gap-3  overflow-y-auto"
                              >
                                {like.profiles?.avatar_url ? (
                                  <img
                                    src={like.profiles?.avatar_url}
                                    className="size-15 object-cover mb-3 rounded-full w-[50px] h-[50px]   "
                                  />
                                ) : (
                                  <IoPersonCircle className="text-3xl w-[60px] h-[60px]" />
                                )}{" "}
                                <a
                                  onClick={() =>
                                    navigate(`/profile/${like.user_id}`)
                                  }
                                  className="text-white hover:underline cursor-pointer duration-200"
                                >
                                  {like.profiles.username}
                                </a>
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
        ))}
      </div>
    </div>
  );
};

export default UserPosts;
