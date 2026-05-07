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
import { useDeletePost, usePostLikes } from "../api/posts/Posts.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";
import { PostgrestError } from "@supabase/supabase-js";
import Comments from "./Comments.jsx";
import { useComment } from "../api/posts/Comment.jsx";
dayjs.extend(relativeTime);

const UserPosts = ({ posts, id }) => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const { mutate: deletepost } = useDeletePost();

  const postId = useMemo(() => posts?.map((post) => post.id), [posts]);
  const { data: postLikes } = usePostLikes(postId);

  const { data: comment } = useComment(postId);

  const [mnueLikes, setmnueLikes] = useState(null);
  const [buttomdelete, setbuttomdelete] = useState(null);
  const [commentmenue, setcommentmenue] = useState(false);
  console.log("postLikes", postLikes);

  console.log(
    "postLikesFilter",
    postLikes
      ?.filter((likeid) => likeid.post_id === mnueLikes)
      .map((like) => like.profiles.username),
  );
  console.log("mnueLikes", mnueLikes);

  const isOwner = profile?.id === id;
  return (
    <div>
      {posts?.length > 0 ? (
        <div className="w-[450px] lg:w-xl ">
          {posts?.map((post) => (
            <div
              key={post.id}
              className="mt-5  rounded-2xl px-4 py-4 shadow-md border border-gray-200"
            >
              <div className="flex justify-between items-center">
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
                      className="hover:underline duration-200 cursor-pointer text-[15px] font-medium text-gray-900"
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
                    <span className="text-gray-400 text-[14px]">
                      {dayjs(post.created_at).fromNow()}
                    </span>
                  </div>
                </div>
                <div>
                  {isOwner && (
                    <div className="relative flex items-center justify-center">
                      <span
                        onClick={() => {
                          setbuttomdelete(post.id);
                        }}
                      >
                        <BsThreeDots className="text-2xl cursor-pointer text-gray-500 " />
                      </span>

                      {buttomdelete === post.id && (
                        <div className="absolute top-8 right-0 w-[140px] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl p-2 flex flex-col gap-1 z-50">
                          <div
                            onClick={() => deletepost(post.id)}
                            className="px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition"
                          >
                            Delete
                          </div>

                          <div
                            onClick={() => setbuttomdelete(null)}
                            className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer transition"
                          >
                            Cancel
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
                              className="rounded-xl w-full"
                            />
                          ) : (
                            <img
                              key={index}
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

                  {/* likes & Comment */}

                  <div className="flex justify-between items-center">
                    {post.post_likes_count?.[0]?.count > 0 && (
                      <div>
                        <button
                          onClick={() => setmnueLikes(post.id)}
                          className="cursor-pointer flex items-center gap-2 px-3 py-1.5 mt-3 rounded-xl text-gray-600 hover:bg-gray-100 active:scale-95 transition-all duration-200"
                        >
                          <span className="text-sm font-medium text-gray-500">
                            {post.post_likes_count?.[0]?.count}
                          </span>

                          <AiFillLike className="text-blue-500 text-lg" />
                        </button>
                      </div>
                    )}
                    {post.comments?.[0]?.count > 0 && (
                      <div
                        onClick={() => setcommentmenue(post.id)}
                        className="cursor-pointer flex items-center px-3 py-1.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 active:scale-95 transition-all duration-200"
                      >
                        {post.comments?.[0]?.count} comment
                      </div>
                    )}
                  </div>

                  <div className=" flex justify-around mt-5">
                    <ButtomLike post={post} />

                    <div
                      onClick={() => setcommentmenue(post.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-gray-600 hover:bg-gray-100 active:scale-95 transition-all duration-200"
                    >
                      <FaRegCommentAlt className="text-xl" />
                      <span className="text-sm font-medium">Comment</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* menuLikes */}
              <div>
                {mnueLikes == post.id && (
                  <div
                    onClick={() => setmnueLikes(null)}
                    className="fixed z-50 inset-0 bg-white/40 backdrop-blur-sm"
                  >
                    <div className="flex justify-center items-center h-screen">
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white/80 backdrop-blur-xl w-[450px] h-[350px] px-5 py-4 rounded-2xl shadow-xl border border-gray-200"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex text-xl items-center gap-1">
                            <span className="text-gray-500 ">
                              {post.post_likes_count?.[0]?.count}
                            </span>
                            <AiFillLike className=" text-blue-500" />
                          </div>

                          <IoCloseSharp
                            onClick={() => setmnueLikes(null)}
                            className="text-3xl bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 cursor-pointer p-1 transition"
                          />
                        </div>

                        <div className="overflow-y-auto max-h-[250px] pr-1">
                          {postLikes
                            ?.filter((likeid) => likeid.post_id === mnueLikes)
                            .map((like, index) => {
                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 py-2 hover:bg-gray-50 px-2 rounded-xl transition"
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
                                      className="cursor-pointer object-cover rounded-full w-[40px] h-[40px]"
                                    />
                                  ) : (
                                    <IoPersonCircle className="text-3xl w-[40px] h-[40px] text-gray-400" />
                                  )}

                                  <span
                                    onClick={() => {
                                      navigate(`/profile/${like.user_id}`);
                                      window.scrollTo({
                                        behavior: "smooth",
                                        top: 0,
                                      });
                                    }}
                                    className="text-gray-800 text-sm font-medium hover:underline cursor-pointer"
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
              <div>
                {commentmenue === post.id && (
                  <Comments
                    usecomment={comment}
                    postLikes={postLikes}
                    setmnueLikes={setmnueLikes}
                    mnueLikes={mnueLikes}
                    setcommentmenue={setcommentmenue}
                    post={post}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center mt-10 text-gray-500">
          <div>No Posts available</div>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
