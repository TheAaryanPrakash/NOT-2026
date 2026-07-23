import { supabase } from "../supabaseClient";

export const fetchQuizAttempts = async (groupId) => {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createQuizAttempt = async (userId, groupId, score, total) => {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({ user_id: userId, group_id: groupId, score, total })
    .select()
    .single();

  if (error) throw error;
  return data;
};
