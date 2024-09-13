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

export async function fetchHopeByName(name: string) {
  try {
    const { data } = await api.get(`/hopes/name/${name}`);
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
