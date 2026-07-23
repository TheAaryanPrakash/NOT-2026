import { supabase } from "../supabaseClient";
import { uploadFlashcardImage } from "../storage";

const GROUP_WITH_TERMS_SELECT = "*, flashcard_terms(*)";

const sortTerms = (group) => ({
  ...group,
  flashcard_terms: [...(group.flashcard_terms || [])].sort(
    (a, b) => a.position - b.position
  ),
});

export const fetchFlashcardGroups = async (userId) => {
  const { data, error } = await supabase
    .from("flashcard_groups")
    .select(GROUP_WITH_TERMS_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(sortTerms);
};

export const fetchFlashcardGroup = async (groupId) => {
  const { data, error } = await supabase
    .from("flashcard_groups")
    .select(GROUP_WITH_TERMS_SELECT)
    .eq("id", groupId)
    .single();

  if (error) throw error;
  return sortTerms(data);
};

// Resolves a term/group's final image URL: uploads a newly-picked file,
// otherwise keeps whatever URL (or null) is already in the form value.
const resolveImageUrl = async (userId, file, currentUrl) => {
  if (file) return uploadFlashcardImage(userId, file);
  return currentUrl || null;
};

export const createFlashcardGroup = async (userId, values) => {
  const groupImageUrl = await resolveImageUrl(
    userId,
    values.groups.ProfileFile,
    values.groups.Profile
  );

  const { data: group, error: groupError } = await supabase
    .from("flashcard_groups")
    .insert({
      user_id: userId,
      name: values.groups.group,
      description: values.groups.groupDesc,
      image_url: groupImageUrl,
    })
    .select()
    .single();

  if (groupError) throw groupError;

  const terms = await Promise.all(
    values.terms.map(async (term, index) => ({
      group_id: group.id,
      term: term.term,
      definition: term.definition,
      image_url: await resolveImageUrl(userId, term.imageFile, term.image),
      position: index,
    }))
  );

  const { error: termsError } = await supabase
    .from("flashcard_terms")
    .insert(terms);

  if (termsError) throw termsError;

  return fetchFlashcardGroup(group.id);
};

export const updateFlashcardGroup = async (userId, groupId, values) => {
  const groupImageUrl = await resolveImageUrl(
    userId,
    values.groups.ProfileFile,
    values.groups.Profile
  );

  const { error: groupError } = await supabase
    .from("flashcard_groups")
    .update({
      name: values.groups.group,
      description: values.groups.groupDesc,
      image_url: groupImageUrl,
    })
    .eq("id", groupId);

  if (groupError) throw groupError;

  // Simplest correct approach for a small per-set term list: replace all terms.
  const { error: deleteError } = await supabase
    .from("flashcard_terms")
    .delete()
    .eq("group_id", groupId);

  if (deleteError) throw deleteError;

  const terms = await Promise.all(
    values.terms.map(async (term, index) => ({
      group_id: groupId,
      term: term.term,
      definition: term.definition,
      image_url: await resolveImageUrl(userId, term.imageFile, term.image),
      position: index,
    }))
  );

  const { error: termsError } = await supabase
    .from("flashcard_terms")
    .insert(terms);

  if (termsError) throw termsError;

  return fetchFlashcardGroup(groupId);
};

export const deleteFlashcardGroup = async (groupId) => {
  const { error } = await supabase
    .from("flashcard_groups")
    .delete()
    .eq("id", groupId);

  if (error) throw error;
};
