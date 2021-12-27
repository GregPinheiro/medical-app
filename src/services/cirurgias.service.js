import api from "./api";

class DataService {
  findAll() {
    return api.get("/cirurgias");
  }

  findOne(id) {
    return api.get(`/cirurgias/${id}`);
  }

  create(data) {
    return api.post("/cirurgias", data);
  }

  update(id, data) {
    return api.put(`/cirurgias/${id}`, data);
  }

  delete(id) {
    return api.delete(`/cirurgias/${id}`);
  }
}

export default new DataService();
