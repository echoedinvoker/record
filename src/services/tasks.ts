import axios from "axios";
import { ColumnRequest, ColumnResponse, TaskBody, TaskResponse } from "../types";

// 设置基础 URL
// const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const BASE_URL = "http://api:8000";

// 创建一个 axios 实例
const api = axios.create({
  baseURL: BASE_URL
});


export async function fetchTasks() {
  const { data } = await api.get("/tasks");
  return data as TaskResponse[]
}

export async function createTask(request: TaskBody) {
  const body = {
    name: request.task,
    estimated_duration: request.estimatedDuration,
    consumed_duration: request.timestampSum,
    markdown_content: request.markdownContent,
  }
  const { data } = await api.post("/tasks", body);
  return data as { id: number }
}

export async function deleteTask(taskId: number) {
  await api.delete(`/tasks/${taskId}`);
}

export async function fetchColumn() {
  const { data } = await api.get("/columns");
  return data as ColumnResponse[]
}

export async function updateColumn(columnId: number, newColumn: ColumnRequest) {
  await api.put(`/columns/${columnId}`, newColumn);
}

export async function addTaskIdToColumn(columnId: number, taskId: number) {
  const { data } = await api.get(`/columns/${columnId}`)
  await api.put(`/columns/${columnId}`, {
    ...data,
    task_order: [...JSON.parse(data.task_order), taskId]
  })
}

export async function removeTaskIdFromColumn(columnId: number, taskId: number) {
  const { data } = await api.get(`/columns/${columnId}`)
  await api.put(`/columns/${columnId}`, {
    ...data,
    task_order: JSON.parse(data.task_order).filter((id: number) => id !== taskId)
  })
}

export async function fetchColumnOrder() {
  const { data } = await api.get("/column_order");
  return data as number[]
}
