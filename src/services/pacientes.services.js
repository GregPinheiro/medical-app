import api from "./api";

class DataService {
  findAll() {
    return api.get("/pacientes");
  }

  findOne(id) {
    return api.get(`/pacientes/${id}`);
  }

  create(data) {
    return api.post("/pacientes", data);
  }

  edit(id, data) {
    return api.put(`/pacientes/${id}`, data);
  }

  delete(data) {
    return api.delete(`/pacientes/${data}`);
  }
}

export default new DataService();
