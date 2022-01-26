import api from "./api";

class DataService {
  findAll() {
    return api.get("/acom-cirurgicos");
  }

  findOne(id) {
    return api.get(`/acom-cirurgicos/${id}`);
  }

  create(data) {
    return api.post("/acom-cirurgicos", data);
  }

  update(id, data) {
    return api.put(`/acom-cirurgicos/${id}`, data);
  }

  delete(id) {
    return api.delete(`/acom-cirurgicos/${id}`);
  }
}

export default new DataService();
