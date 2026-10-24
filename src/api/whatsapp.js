import { apiClient } from "./client";

export const whatsappApi = {
  getConnections: () => apiClient.get("/whatsapp/connections"),
  createConnection: (data) => apiClient.post("/whatsapp/connections", data),
  getConnectionStatus: (id) => apiClient.get(`/whatsapp/connections/${id}/status`),
  startConnection: (id) => apiClient.post(`/whatsapp/connections/${id}/start`),
  disconnectConnection: (id) => apiClient.post(`/whatsapp/connections/${id}/disconnect`),
  removeConnection: (id) => apiClient.delete(`/whatsapp/connections/${id}`),
};
