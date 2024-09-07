import api from ".";
import { CreateHopePayload, HopeResponse } from "../types";


export async function fetchHopes() {
  const { data } = await api.get("/hopes");
  return data as HopeResponse[]
}

export async function createHope(payload: CreateHopePayload) {
  const { data } = await api.post("/hopes", payload);
  return data as { id: number }
}
