import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { useAuth } from "../context/AuthProvider";
import { useLikePost } from "../api/posts/useLikePost";

const ButtomLike = ({ post }) => {
  const { session } = useAuth();
  const { mutate: likepost } = useLikePost();

  const likesArray = Array.isArray(post.post_likes)
    ? post.post_likes
    : post.post_likes
      ? [post.post_likes]
      : [];

  const isLiked = likesArray.some((like) => like.user_id === session?.user?.id);

  console.log(post.post_likes_count?.[0]?.count);

  console.log(post);

  return (
    <div
      onClick={() => likepost({ postId: post.id, isLiked })}
      className="flex active:scale-95 items-center hover:bg-[#b0b3b8] transition-all duration-200 gap-2 px-8 py-1 rounded-md cursor-pointer"
    >
      {isLiked ? (
        <AiFillLike className="text-2xl text-blue-500" />
      ) : (
        <AiOutlineLike className="text-2xl" />
      )}

      <p className={isLiked ? "text-blue-500" : ""}>Like</p>
    </div>
  );
};

export default ButtomLike;
