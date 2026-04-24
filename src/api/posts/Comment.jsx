import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient.js";
import { useAuth } from "../../context/AuthProvider.jsx";

export const useComment = (postId) => {
  return useQuery({
    queryKey: ["comments", postId],
    enabled: !!postId && postId.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(
          `
                id,
                post_id,
                user_id,
                content,
                profiles(
                username,
                avatar_url
                )
                `,
        )
        .in("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useInsertComment = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    async mutationFn(data) {
      const { data: newcomment, error } = await supabase
        .from("comments")
        .insert({
          content: data.content,
          post_id: data.post_id,
          user_id: session.user.id,
        })
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return newcomment;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["comments"] });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
