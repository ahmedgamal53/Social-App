import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
// import { useData } from "../context/Datauser";
import { formatDistanceToNow } from "date-fns";
import { IoPerson } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCommentAlt } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { IoPersonCircle } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { useAuth } from "../context/AuthProvider";
// import { useProfileImage } from "../context/ProfileImageContext";

const Comment = ({
  item,
  setcommentmenue,
  setMenuePostId,
  menuePostId,
  setupload,
  commentmenue,
}) => {
  const [commentinput, setcommentinput] = useState("");

  const handelclick = () => {
    if (!commentinput.trim()) return;

    setupload((prev) =>
      prev.map((post) =>
        post.id === item.id
          ? {
              ...post,
              rightcomment: [
                ...(post.rightcomment || []),
                {
                  id: Date.now(),
                  text: commentinput,
                  username: null,
                },
              ],
            }
          : post,
      ),
    );
    setcommentinput("");
  };

  const { session } = useAuth;
  return (
    <div>
      {commentmenue === item.id && (
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
              <span className="text-white text-2xl">{item.username}'spost</span>
              <div></div>
            </div>

            {/* content */}
            <div>
              <div className="">
                <div className="mt-5 rounded-md px-3 py-3 shadow-2xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <IoPersonCircle className="text-3xl" />

                      <div>
                        <h3 className="text-white">{item.username}</h3>
                        <span className="text-gray-400">
                          {" "}
                          {formatDistanceToNow(item.id, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <div>
                      <button>
                        <BsThreeDots className="text-3xl cursor-pointer" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 px-4 flex flex-col gap-5">
                    <p className="text-white text-xl">{item.text}</p>
                    <div>
                      <div
                        className={`grid  gap-3 px-5 mt-3 ${item.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
                      >
                        {item.images?.map((media, index) => (
                          <div key={index} className="w-full ">
                            {media.file.type.startsWith("image/") && (
                              <img
                                src={media.url}
                                className="rounded-md  min-w-full"
                                alt=""
                              />
                            )}
                            {media.file.type.startsWith("video/") && (
                              <video
                                src={media.url}
                                controls
                                className="rounded-md w-full"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* likes & Comment */}
                  <div>
                    {item.likes.length > 0 && (
                      <button
                        onClick={() => setMenuePostId(item.id)}
                        className="cursor-pointer flex items-center gap-1 px-7 mt-3"
                      >
                        <span className="text-gray-500 text-xl">
                          {item.likes.length}
                        </span>
                        <AiFillLike className="text-blue-500 text-2xl" />
                      </button>
                    )}
                  </div>

                  <div className=" flex justify-around mt-5">
                    <div
                      onClick={() => {
                        setupload((prev) =>
                          prev.map((post) => {
                            if (post.id !== item.id) return post;
                            const alredyliked = post.likes.includes(session);
                            return {
                              ...post,
                              liked: !post.liked,
                              likes: alredyliked
                                ? post.likes.filter((u) => u !== session)
                                : [...post.likes, session],
                            };
                          }),
                        );
                      }}
                      className="flex active:scale-95 items-center hover:bg-[#b0b3b8] transition-all duration-200 gap-2 px-8 py-1 rounded-md cursor-pointer"
                    >
                      {item.liked ? (
                        <AiFillLike className="text-2xl text-blue-500 " />
                      ) : (
                        <AiOutlineLike className=" text-2xl " />
                      )}
                      <p
                        className={`text-xl ${item.liked ? "text-blue-500" : null}`}
                      >
                        Like
                      </p>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <FaRegCommentAlt className="text-2xl" />
                      <p>Comment</p>
                    </div>
                  </div>
                  {/* menue */}
                  <div>
                    {menuePostId === item.id && (
                      <div
                        onClick={() => setMenuePostId(null)}
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
                                  {item.likes.length}
                                </span>
                                <AiFillLike className="text-2xl  text-blue-500" />
                              </div>
                              <IoCloseSharp
                                onClick={() => setMenuePostId(null)}
                                className="text-3xl bg-gray-600 rounded-4xl text-white cursor-pointer "
                              />
                            </div>
                            {item.likes.map((user, index) => (
                              <div
                                key={index}
                                className="mt-10 flex items-center justify-between gap-3  overflow-y-auto"
                              >
                                <IoPersonCircle className="text-3xl" />

                                <span className="text-white">{user}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* comments */}
            <div className="my-7 mx-4">
              {item.rightcomment?.map((item, index) => (
                <div key={index} className="mt-5">
                  <div className="flex gap-3">
                    <IoPersonCircle className="text-3xl" />

                    <div className="bg-[#313232] px-5 py-3 rounded-md text-white flex-1">
                      <h3>{item.username}</h3>
                      <p>{item.text}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 ml-11 mt-3 ">
                    {" "}
                    {formatDistanceToNow(item.id, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              ))}
            </div>

            {/* input */}
            <div className="mt-auto sticky bottom-0 bg-[#313232] px-5 py-5 z-60  w-full flex items-center gap-3">
              <IoPersonCircle className="text-3xl" />

              <div className="bg-gray-500/20 flex flex-1 rounded-2xl  px-5 py-4">
                <input
                  type="text"
                  placeholder="Write your comment"
                  value={commentinput}
                  onChange={(e) => setcommentinput(e.target.value)}
                  className="w-full text-white outline-none"
                />
                <button
                  onClick={handelclick}
                  disabled={!commentinput}
                  className="cursor-pointer text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed text-2xl"
                >
                  <IoIosSend />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
