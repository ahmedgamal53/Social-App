// import { useData } from "../context/Datauser";
import { IoPerson } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCommentAlt } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { IoPersonCircle } from "react-icons/io5";
import Comment from "./Comment";
import { useAuth } from "../context/AuthProvider";
// import { useProfileImage } from "../context/ProfileImageContext";

const Upload = ({ upload, setupload }) => {
  // const { username } = useData();
  const [menuePostId, setMenuePostId] = useState(null);
  const [commentmenue, setcommentmenue] = useState(null);
  // const { profileImage } = useProfileImage();
  const { session } = useAuth;
  return (
    <div>
      {upload && (
        <div className="w-xl">
          {upload?.map((item, index) => (
            <div
              key={index}
              className="mt-5 bg-white rounded-md px-3 py-3 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <IoPersonCircle className="text-3xl" />

                  <div>
                    <h3>{item.username}</h3>
                    {formatDistanceToNow(item.id, {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div>
                  <button>
                    <BsThreeDots className="text-3xl cursor-pointer" />
                  </button>
                </div>
              </div>
              <div className="mt-5 px-4 flex flex-col gap-5">
                <p>{item.text}</p>
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
              <div className="flex items-center justify-between">
                {item.likes.length > 0 ? (
                  <button
                    onClick={() => setMenuePostId(item.id)}
                    className="cursor-pointer flex items-center gap-1 px-7 mt-3"
                  >
                    <span className="text-gray-500 text-xl">
                      {item.likes.length}
                    </span>
                    <AiFillLike className="text-blue-500 text-2xl" />
                  </button>
                ) : (
                  <div></div>
                )}
                <div>
                  {item.rightcomment.length > 0 && (
                    <button
                      onClick={() => setcommentmenue(item.id)}
                      className="cursor-pointer flex items-center gap-1 px-7 mt-3"
                    >
                      <span>{item.rightcomment.length} Comment</span>
                    </button>
                  )}
                </div>
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
                <div
                  onClick={() => {
                    setcommentmenue(item.id);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
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
              {/* Comments */}
              <div>
                {commentmenue === item.id && (
                  <Comment
                    item={item}
                    setcommentmenue={setcommentmenue}
                    setMenuePostId={setMenuePostId}
                    menuePostId={menuePostId}
                    setupload={setupload}
                    commentmenue={commentmenue}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Upload;
