import api from "./axios";

export const orderAPI = {
  create: (data) => api.post("orders/", data),
  getAll: () => api.get("orders/"),
  getOne: (id) => api.get(`orders/${id}/`),
};
