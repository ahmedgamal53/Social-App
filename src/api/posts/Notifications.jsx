import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthProvider";
import { supabase } from "../../supabaseClient.js";

export const useNotifications = () => {
  const { session } = useAuth();
  const id = session?.user.id;
  return useQuery({
    queryKey: ["notifications", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
          id,
          type,
          is_read,
          created_at,
          post_id,
          user_id, 
          sender:sender_id (
            username,
            avatar_url
          )
        `,
        )
        .eq("user_id", id)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useInsertNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data) {
      const { error, data: notification } = await supabase
        .from("notifications")
        .insert({
          user_id: data.user_id,
          sender_id: data.sender_id,
          post_id: data.post_id,
          type: data.type,
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return notification;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(id) {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
