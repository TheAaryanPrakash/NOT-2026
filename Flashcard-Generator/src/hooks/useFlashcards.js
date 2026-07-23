import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import {
  createFlashcardGroup,
  deleteFlashcardGroup,
  fetchFlashcardGroup,
  fetchFlashcardGroups,
  updateFlashcardGroup,
} from "../lib/api/flashcards";

const groupsKey = (userId) => ["flashcardGroups", userId];
const groupKey = (groupId) => ["flashcardGroup", groupId];

export const useFlashcardGroups = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: groupsKey(user?.id),
    queryFn: () => fetchFlashcardGroups(user.id),
    enabled: !!user,
  });
};

export const useFlashcardGroup = (groupId) => {
  return useQuery({
    queryKey: groupKey(groupId),
    queryFn: () => fetchFlashcardGroup(groupId),
    enabled: !!groupId,
  });
};

export const useCreateFlashcardGroup = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => createFlashcardGroup(user.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsKey(user.id) });
    },
  });
};

export const useUpdateFlashcardGroup = (groupId) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => updateFlashcardGroup(user.id, groupId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsKey(user.id) });
      queryClient.invalidateQueries({ queryKey: groupKey(groupId) });
    },
  });
};

export const useDeleteFlashcardGroup = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId) => deleteFlashcardGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsKey(user.id) });
    },
  });
};
