import api from "./api";

class DataService {
  signin(data) {
    return api.post("user/signin", data);
  }
}

export default new DataService();
