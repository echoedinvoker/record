import api from ".";

export interface Threshold {
  multiplier: number;
  thresholdNumber: number;
  unit: string;
}

export interface Precept {
  key: string;
  name: string;
  startEndTimes: number[];
  baseMultiplier: number;
  thresholds: Threshold[];
  hopeKey: string;
}

export interface PreceptRequest {
  key: string;
  name: string;
  start_end_times: string;
  base_multiplier: number;
  thresholds: string;
  hope_key: string;
}

export interface PreceptResponse {
  id?: number;
  key: string;
  name: string;
  start_end_times: string;
  base_multiplier: number;
  thresholds: string;
  hope_key: string;
}

export const getAllPrecepts = async (): Promise<Precept[]> => {
  const response: { data: PreceptResponse[] } = await api.get(`/precepts`)
  return response.data.map((precept) => ({
    key: precept.key,
    name: precept.name,
    startEndTimes: precept.start_end_times.split(',').map(Number) as [number, number],
    baseMultiplier: precept.base_multiplier,
    thresholds: JSON.parse(precept.thresholds) as Threshold[],
    hopeKey: precept.hope_key,
  }));
};

export const getPrecept = async (id: number): Promise<Precept> => {
  const response: { data: PreceptResponse } = await api.get(`/precepts/${id}`);
  return {
    key: response.data.key,
    name: response.data.name,
    startEndTimes: response.data.start_end_times.split(',').map(Number) as [number, number],
    baseMultiplier: response.data.base_multiplier,
    thresholds: JSON.parse(response.data.thresholds) as Threshold[],
    hopeKey: response.data.hope_key,
  };
};

export const createPrecept = async (precept: Precept): Promise<{ id: number }> => {
  const payload: PreceptRequest = {
    key: precept.key,
    name: precept.name,
    start_end_times: precept.startEndTimes.join(','),
    base_multiplier: precept.baseMultiplier,
    thresholds: JSON.stringify(precept.thresholds),
    hope_key: precept.hopeKey,
  };
  const response: { data: { id: number } } = await api.post(`/precepts`, payload);
  return response.data;
};

export const updatePrecept = async (id: number, precept: Precept): Promise<void> => {
  const payload: PreceptRequest = {
    key: precept.key,
    name: precept.name,
    start_end_times: precept.startEndTimes.join(','),
    base_multiplier: precept.baseMultiplier,
    thresholds: JSON.stringify(precept.thresholds),
    hope_key: precept.hopeKey,
  };
  await api.put(`/precepts/${id}`, payload);
};

export const deletePrecept = async (id: number): Promise<void> => {
  await api.delete(`/precepts/${id}`);
};

export const deletePreceptByKey = async (key: string): Promise<void> => {
  await api.delete(`/precepts/key/${key}`);
};

export const updatePreceptByKey = async (key: string, precept: Precept): Promise<void> => {
  const payload: PreceptRequest = {
    key: precept.key,
    name: precept.name,
    start_end_times: precept.startEndTimes.join(','),
    base_multiplier: precept.baseMultiplier,
    thresholds: JSON.stringify(precept.thresholds),
    hope_key: precept.hopeKey,
  };
  await api.put(`/precepts/key/${key}`, payload);
};
