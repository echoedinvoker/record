import api from ".";
import { CreateHopePayload, HopeResponse, UpdateHopePayload } from "../types";


export async function fetchHopes() {
  const { data } = await api.get("/hopes");
  return data as HopeResponse[]
}

export async function createHope(payload: CreateHopePayload) {
  const { data } = await api.post("/hopes", payload);
  return data as { id: number }
}

export async function deleteHope(hopeId: number) {
  await api.delete(`/hopes/${hopeId}`);
}

export async function deleteHopeByKey(key: string) {
  await api.delete(`/hopes/key/${key}`);
}

export async function fetchHopeByKey(key: string) {
  try {
    const { data } = await api.get(`/hopes/key/${key}`);
    return data as HopeResponse;
  } catch (error) {
    return null;
  }
}

export async function updateHope(payload: UpdateHopePayload) {
  try {
    await api.put(`/hopes`, payload);
  } catch (error) {
    return null;
  }
}
