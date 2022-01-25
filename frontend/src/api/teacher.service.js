import api from "./api";

class TeacherService {
  getTeachers() {
    return api.get("/api/teacher");
  }

  getTeacherSubjects(id) {
    return api.get("/api/teacher/" + id + "/subject");
  }
}

export default new TeacherService();
