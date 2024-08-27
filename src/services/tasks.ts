import axios from "axios";

export async function fetchTasks() {
  const { data } = await axios.get("http://localhost:8000/tasks");
  return data;
}

export async function fetchColumn() {
  const { data } = await axios.get("http://localhost:8000/columns");
  return data;
}

export async function fetchColumnOrder() {
  const { data } = await axios.get("http://localhost:8000/column_order");
  return data;
}
