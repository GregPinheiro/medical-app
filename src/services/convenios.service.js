import api from "./api";

class DataService {
  findAll() {
    return api.get("/convenios");
  }

  findOne(id) {
    return api.get(`/convenios/${id}`);
  }

  create(data) {
    return api.post("/convenios", data);
  }

  update(id, data) {
    return api.put(`/convenios/${id}`, data);
  }

  delete(id) {
    return api.delete(`/convenios/${id}`);
  }

  setHospitais(id, data) {
    return api.post(`/convenios/hospitais/${id}`, data);
  }
}

export default new DataService();
