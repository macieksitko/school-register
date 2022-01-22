import api from "./api";

class TeacherService {
  getTeachers() {
    return api.get("/api/teacher");
  }
}

export default new TeacherService();
