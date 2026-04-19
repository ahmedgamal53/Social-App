import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthProvider";
import { supabase } from "../../supabaseClient.js";

export const useLikePost = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, isLiked }) => {
      const userId = session.user.id;
      if (isLiked) {
        await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);
      } else {
        await supabase.from("post_likes").insert({
          post_id: postId,
          user_id: userId,
        });
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
