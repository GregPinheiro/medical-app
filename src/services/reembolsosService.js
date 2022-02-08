import api from "./api";

class DataService {
  findAll() {
    return api.get("/reembolsos");
  }

  findOne(id) {
    return api.get(`/reembolsos/${id}`);
  }

  create(data) {
    return api.post("/reembolsos", data);
  }

  update(id, data) {
    return api.put(`/reembolsos/${id}`, data);
  }

  delete(id) {
    return api.delete(`/reembolsos/${id}`);
  }
}

export default new DataService();
