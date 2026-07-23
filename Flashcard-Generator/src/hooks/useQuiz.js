import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { createQuizAttempt, fetchQuizAttempts } from "../lib/api/quiz";

const attemptsKey = (groupId) => ["quizAttempts", groupId];

export const useQuizAttempts = (groupId) => {
  return useQuery({
    queryKey: attemptsKey(groupId),
    queryFn: () => fetchQuizAttempts(groupId),
    enabled: !!groupId,
  });
};

export const useCreateQuizAttempt = (groupId) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ score, total }) =>
      createQuizAttempt(user.id, groupId, score, total),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attemptsKey(groupId) });
    },
  });
};
