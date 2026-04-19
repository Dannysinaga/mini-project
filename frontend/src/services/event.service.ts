import axios from "axios";
import type { Event } from "../types/event";

const API_URL = "http://localhost:8000";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface GetEventsParams {
  search?: string;
  category?: string;
  location?: string;
}

export const getEvents = async (
  params?: GetEventsParams
): Promise<Event[]> => {
  const response = await axios.get<ApiResponse<Event[]>>(`${API_URL}/events`, {
    params,
  });
  return response.data.data;
};

export const getEventDetail = async (id: string): Promise<Event> => {
  const response = await axios.get<ApiResponse<Event>>(
    `${API_URL}/events/${id}`
  );
  return response.data.data;
};