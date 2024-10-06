
import axios from 'axios';

// 定義 Precept 介面
export interface Precept {
  id?: number;
  key: string;
  start_end_times: string;
  base_multiplier: number;
  thresholds: string;
  hope_key: string;
}

// 定義 API 的基礎 URL
const API_BASE_URL = '/api'; // 根據實際情況調整

// 獲取所有 Precepts
export const getAllPrecepts = async (): Promise<Precept[]> => {
  const response = await axios.get(`${API_BASE_URL}/precepts`);
  return response.data;
};

// 獲取單個 Precept
export const getPrecept = async (id: number): Promise<Precept> => {
  const response = await axios.get(`${API_BASE_URL}/precepts/${id}`);
  return response.data;
};

// 創建新的 Precept
export const createPrecept = async (precept: Omit<Precept, 'id'>): Promise<{ id: number }> => {
  const response = await axios.post(`${API_BASE_URL}/precepts`, precept);
  return response.data;
};

// 更新 Precept
export const updatePrecept = async (id: number, precept: Omit<Precept, 'id'>): Promise<void> => {
  await axios.put(`${API_BASE_URL}/precepts/${id}`, precept);
};

// 刪除 Precept
export const deletePrecept = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/precepts/${id}`);
};

// 根據 key 刪除 Precept
export const deletePreceptByKey = async (key: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/precepts/key/${key}`);
};

// 根據 key 更新 Precept
export const updatePreceptByKey = async (key: string, precept: Omit<Precept, 'id'>): Promise<void> => {
  await axios.put(`${API_BASE_URL}/precepts/key/${key}`, precept);
};
