import api from ".";
import { ColumnRequest, ColumnResponse, TaskBody, TaskRequest, TaskResponse } from "../types";


export async function updateTask(taskId: number, newTask: TaskBody) {
  const body: TaskRequest = {
    key: newTask.key,
    name: newTask.task,
    estimated_duration: newTask.estimatedDuration,
    consume_timestamp: newTask.timestampSum,
    markdown_content: newTask.markdownContent,
  }
  if (newTask.timestamp) {
    body["start_timestamp"] = newTask.timestamp
  }
  if (newTask.ts) {
    body["ts"] = newTask.ts
  }
  await api.put(`/tasks/${taskId}`, body);
}

export async function fetchTasks() {
  const { data } = await api.get("/tasks");
  return data as TaskResponse[]
}

export async function fetchTaskByKey(key: string) {
  const { data } = await api.get(`/tasks/key/${key}`);
  return data as TaskResponse
}

export async function fetchColumnByKey(key: string) {
  const { data } = await api.get(`/columns/key/${key}`);
  return data as ColumnResponse
}

export async function createTask(request: TaskBody) {
  const body: TaskRequest = {
    key: request.key,
    name: request.task,
    estimated_duration: request.estimatedDuration,
    consume_timestamp: request.timestampSum,
    markdown_content: request.markdownContent,
  }

  if (request.timestamp) {
    body["start_timestamp"] = request.timestamp
  }
  if (request.ts) {
    body["ts"] = request.ts
  }

  const { data } = await api.post("/tasks", body);
  return data as { id: number }
}

export async function createColumn(request: ColumnRequest) {
  await api.post("/columns", request);
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
  return data as string[]
}
