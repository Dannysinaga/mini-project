import axios from "axios";
import type { Event } from "../types/event";

const API_URL = "http://localhost:8000";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getEvents = async (): Promise<Event[]> => {
  const response = await axios.get<ApiResponse<Event[]>>(`${API_URL}/events`);
  return response.data.data;
};

export const getEventDetail = async (id: string): Promise<Event> => {
  const response = await axios.get<ApiResponse<Event>>(`${API_URL}/events/${id}`);
  return response.data.data;
};