import api from "./api";

class DataService {
  findAll() {
    return api.get("/medicos");
  }

  findOne(id) {
    return api.get(`/medicos/${id}`);
  }

  create(data) {
    return api.post("/medicos", data);
  }

  update(id, data) {
    return api.put(`/medicos/${id}`, data);
  }

  delete(id) {
    return api.delete(`/medicos/${id}`);
  }

  setHospital(id, data) {
    return api.post(`/medicos/hospitais/${id}`, data);
  }
}

export default new DataService();
