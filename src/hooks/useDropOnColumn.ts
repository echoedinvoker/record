import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTasks } from "./useTasks";
import { ColumnRequest, Data, OnDragEndResultType } from "../types";
import { updateColumn } from "../services/tasks";


export function useDropOnColumn() {
  const { data } = useTasks()
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (onDragEndResult: OnDragEndResultType) => {
      if (!data) return
      const promise1 = removeTaskIdFromSourceColumn(data, onDragEndResult)
      const promise2 = addTaskIdToDestinationColumn(data, onDragEndResult)
      await Promise.all([promise1, promise2])
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })
}

async function removeTaskIdFromSourceColumn(data: Data, onDragEndResult: OnDragEndResultType) {
  const newSourceColumn = getNewSourceColumn(data, onDragEndResult)
  const columnId = turnFrontendColumnIdToBackendColumnId(onDragEndResult.source.droppableId)
  await updateColumn(columnId, newSourceColumn)
}

function getNewSourceColumn(data: Data, onDragEndResult: OnDragEndResultType): ColumnRequest {
  const taskIds = data.columns[onDragEndResult.source.droppableId].taskIds
  const filteredTaskIds = taskIds.filter((taskId) => taskId !== onDragEndResult.draggableId)
  const integerTaskIds = filteredTaskIds.map((taskId) => parseInt(taskId))
  return { task_order: integerTaskIds }
}

async function addTaskIdToDestinationColumn(data: Data, onDragEndResult: OnDragEndResultType) {
  const newDestinationColumn = getNewDestinationColumn(data, onDragEndResult)
  const columnId = turnFrontendColumnIdToBackendColumnId(onDragEndResult.destination.droppableId)
  await updateColumn(columnId, newDestinationColumn)
}

function getNewDestinationColumn(data: Data, onDragEndResult: OnDragEndResultType): ColumnRequest {
  const taskIds = data.columns[onDragEndResult.destination.droppableId].taskIds
  const integerTaskIds = taskIds.map((taskId) => parseInt(taskId))
  integerTaskIds.splice(onDragEndResult.destination.index, 0, parseInt(onDragEndResult.draggableId))
  return { task_order: integerTaskIds }
}

function turnFrontendColumnIdToBackendColumnId(columnId: string): number {
  if (columnId === 'done') return 1
  return parseInt(columnId) + 2
}
