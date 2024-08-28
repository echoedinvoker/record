import axios from "axios";
import { ColumnRequest, ColumnResponse, TaskBody, TaskResponse } from "../types";

export async function fetchTasks() {
  const { data } = await axios.get("http://localhost:8000/tasks");
  return data as TaskResponse[]
}

export async function createTask(request: TaskBody) {
  const body = {
    name: request.task,
    estimated_duration: request.estimatedDuration,
    consumed_duration: request.timestampSum,
    markdown_content: request.markdownContent,
  }
  const { data } = await axios.post("http://localhost:8000/tasks", body);
  return data as { id: number }
}

export async function deleteTask(taskId: number) {
  await axios.delete(`http://localhost:8000/tasks/${taskId}`);
}

export async function fetchColumn() {
  const { data } = await axios.get("http://localhost:8000/columns");
  return data as ColumnResponse[]
}

export async function updateColumn(columnId: number, newColumn: ColumnRequest) {
  await axios.put(`http://localhost:8000/columns/${columnId}`, newColumn);
}

export async function addTaskIdToColumn(columnId: number, taskId: number) {
  const { data } = await axios.get(`http://localhost:8000/columns/${columnId}`)
  await axios.put(`http://localhost:8000/columns/${columnId}`, {
    ...data,
    task_order: [...JSON.parse(data.task_order), taskId]
  })
}

export async function removeTaskIdFromColumn(columnId: number, taskId: number) {
  const { data } = await axios.get(`http://localhost:8000/columns/${columnId}`)
  await axios.put(`http://localhost:8000/columns/${columnId}`, {
    ...data,
    task_order: JSON.parse(data.task_order).filter((id: number) => id !== taskId)
  })
}

export async function fetchColumnOrder() {
  const { data } = await axios.get("http://localhost:8000/column_order");
  return data as number[]
}
