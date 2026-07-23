import { supabase } from "./supabaseClient";

const BUCKET = "flashcard-images";

// Uploads a File under the current user's folder and returns its public URL.
export const uploadFlashcardImage = async (userId, file) => {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file);
  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return publicUrl;
};
