import api from "./api";

class DataService {
  findAll() {
    return api.get("/fornecedores");
  }

  findOne(id) {
    return api.get(`/fornecedores/${id}`);
  }

  create(data) {
    return api.post("/fornecedores", data);
  }

  update(id, data) {
    return api.put(`/fornecedores/${id}`, data);
  }

  delete(id) {
    return api.delete(`/fornecedores/${id}`);
  }
}

export default new DataService();
