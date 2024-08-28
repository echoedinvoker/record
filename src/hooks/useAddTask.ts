import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addTaskIdToColumn, createTask } from "../services/tasks"
import { TaskBody } from "../types"

export function useAddTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (task: TaskBody) => {
      const response = await createTask(task)
      await addTaskIdToColumn(task.columnId, response.id)
    },
    onSuccess: () => {
      console.log('Task added')
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (err: Error) => {
      console.error(err)
    }
  })
  }
