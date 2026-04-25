import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { useAuth } from "../context/AuthProvider";
import { useLikePost } from "../api/posts/useLikePost";
import { useInsertNotification } from "../api/posts/Notifications";

const ButtomLike = ({ post }) => {
  const { session } = useAuth();
  const { mutate: likepost } = useLikePost();
  const { mutate: insertNotification } = useInsertNotification();
  const likesArray = Array.isArray(post.post_likes)
    ? post.post_likes
    : post.post_likes
      ? [post.post_likes]
      : [];

  const isLiked = likesArray.some((like) => like.user_id === session?.user?.id);

  console.log(post.post_likes_count?.[0]?.count);

  console.log(post);

  const handelLike = () => {
    likepost({ postId: post.id, isLiked });
    if (!isLiked && post.user_id !== session.user.id) {
      insertNotification({
        user_id: post.user_id,
        sender_id: session.user.id,
        post_id: post.id,
        type: "like",
      });
    }
  };

  return (
    <div
      onClick={handelLike}
      className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-gray-600 hover:bg-gray-100 active:scale-95 transition-all duration-200"
    >
      {isLiked ? (
        <AiFillLike className="text-xl text-blue-500" />
      ) : (
        <AiOutlineLike className="text-xl" />
      )}

      <span className={`text-sm font-medium ${isLiked ? "text-blue-500" : ""}`}>
        Like
      </span>
    </div>
  );
};

export default ButtomLike;
