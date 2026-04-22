import axios from "axios";
import type { Transaction } from "../types/transaction";

const API_URL = "http://localhost:8000";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getTransactionHistory = async (
  userId: string
): Promise<Transaction[]> => {
  const response = await axios.get<ApiResponse<Transaction[]>>(
    `${API_URL}/transactions`,
    {
      params: { userId },
    }
  );

  return response.data.data;
};

export const uploadPaymentProof = async (
  transactionId: string,
  paymentProofUrl: string
): Promise<Transaction> => {
  const response = await axios.patch<ApiResponse<Transaction>>(
    `${API_URL}/transactions/${transactionId}/upload-proof`,
    { paymentProofUrl }
  );

  return response.data.data;
};

export const getPendingTransactions = async (
  organizerId: string
): Promise<Transaction[]> => {
  const response = await axios.get<ApiResponse<Transaction[]>>(
    `${API_URL}/transactions/pending/list`,
    {
      params: { organizerId },
    }
  );

  return response.data.data;
};

export const approveTransaction = async (
  transactionId: string
): Promise<Transaction> => {
  const response = await axios.patch<ApiResponse<Transaction>>(
    `${API_URL}/transactions/${transactionId}/approve`
  );

  return response.data.data;
};

export const rejectTransaction = async (
  transactionId: string,
  rejectionReason: string
): Promise<Transaction> => {
  const response = await axios.patch<ApiResponse<Transaction>>(
    `${API_URL}/transactions/${transactionId}/reject`,
    { rejectionReason }
  );

  return response.data.data;
};