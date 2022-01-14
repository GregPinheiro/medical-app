import api from "./api";

class DataService {
  findAll() {
    return api.get("/consultas");
  }

  findOne(id) {
    return api.get(`/consultas/${id}`);
  }

  create(data) {
    return api.post("/consultas", data);
  }

  update(id, data) {
    return api.put(`/consultas/${id}`, data);
  }

  delete(id) {
    return api.delete(`/consultas/${id}`);
  }
}

export default new DataService();
