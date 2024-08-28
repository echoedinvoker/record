import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, removeTaskIdFromColumn } from "../services/tasks";

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, columnId }: { taskId: number, columnId: number }) => {
      const promise1 = deleteTask(taskId);
      const promise2 = removeTaskIdFromColumn(columnId, taskId);
      return await Promise.all([promise1, promise2]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err: Error) => {
      console.error(err);
    },
  });
}

