import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { Idea } from "../backend.d";

export function useGetAllIdeas() {
  const { actor, isFetching } = useActor();
  return useQuery<Idea[]>({
    queryKey: ["ideas"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllIdeas();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateIdea() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      category,
    }: {
      title: string;
      description: string;
      category: string;
    }) => {
      if (!actor) throw new Error("No actor available");
      return actor.createIdea(title, description, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });
}

export function useDeleteIdea() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor available");
      return actor.deleteIdea(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });
}

export function useToggleFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor available");
      return actor.toggleFavorite(id);
    },
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["ideas"] });
      const prev = queryClient.getQueryData<Idea[]>(["ideas"]);
      queryClient.setQueryData<Idea[]>(["ideas"], (old) =>
        old?.map((idea) =>
          idea.id === id ? { ...idea, isFavorite: !idea.isFavorite } : idea
        )
      );
      return { prev };
    },
    onError: (_err, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["ideas"], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });
}
