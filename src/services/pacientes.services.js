import api from "./api";

class DataService {
  findAll() {
    return api.get("pacientes");
  }
}

export default new DataService();
