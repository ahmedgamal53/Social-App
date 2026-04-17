import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient.js";
import { useAuth } from "../../context/AuthProvider.jsx";
export const useUserPosts = () => {
  const { session } = useAuth();
  const id = session?.user.id;

  return useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
    id,
    caption,
    images,
    created_at,
    likes,
    commint,
    user_id,
    profiles (
      username,
      avatar_url
    )
  `,
        )
        .eq("user_id", id)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const usePostLikes = (postId) => {
  return useQuery({
    queryKey: ["post_likes", postId],
    queryFn: async () => {
      if (!postId) return [];
      const { data, error } = await supabase
        .from("post_likes")
        .select(
          `
            id,
          user_id,
          profiles (
            username,
            avatar_url
          )
                `,
        )
        .eq("post_id", postId);
      if (error) throw new Error(error.message);
      return data;
    },
  });
};
