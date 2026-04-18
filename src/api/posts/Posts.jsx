import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient.js";
import { useAuth } from "../../context/AuthProvider.jsx";
export const useUserPosts = () => {
  const { session } = useAuth();
  const id = session?.user.id;

  return useQuery({
    queryKey: ["posts", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
  id,
  caption,
  images,
  created_at,
  user_id,
  profiles (
    username,
    avatar_url
  ),
  post_likes_count:post_likes(count),
  post_likes_users:post_likes(user_id),
  comments(count)
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

export const useInsertPost = () => {
  const { session } = useAuth();
  const id = session?.user.id;
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data) {
      if (!id) return null;

      const { data: newpost, error } = await supabase
        .from("posts")
        .insert({
          caption: data.caption,
          images: data.images,
          user_id: id,
        })
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return newpost;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
