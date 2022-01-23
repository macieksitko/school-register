import api from "./api";

class UserService {
  async addUser(body) {
    try {
      const response = await api.post("/api/users/create", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.status === 201;
    } catch (error) {
      return error.response.data.message;
    }
  }
}

export default new UserService();
