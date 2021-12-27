import api from "./api";

class DataService {
  findAll() {
    return api.get("/hospitais");
  }

  findOne(id) {
    return api.get(`/hospitais/${id}`);
  }

  create(data) {
    return api.post("/hospitais", data);
  }

  update(id, data) {
    return api.put(`/hospitais/${id}`, data);
  }

  delete(id) {
    return api.delete(`/hospitais/${id}`);
  }
}

export default new DataService();
