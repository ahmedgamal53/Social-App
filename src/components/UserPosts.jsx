import { IoPerson } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCommentAlt } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { IoPersonCircle } from "react-icons/io5";
import { useAuth } from "../context/AuthProvider";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ButtomLike from "./ButtomLike.jsx";
dayjs.extend(relativeTime);

const UserPosts = ({ posts }) => {
  const { profile } = useAuth();

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
                {profile?.avatar_url ? (
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
                <div className=" flex justify-around mt-5">
                  <ButtomLike post={post} />

                  <div className="flex items-center gap-2 cursor-pointer">
                    <FaRegCommentAlt className="text-2xl" />
                    <p>Comment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPosts;
