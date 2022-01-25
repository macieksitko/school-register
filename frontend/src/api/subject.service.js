import api from "./api";

class SubjectService {
  getSubjects() {
    return api.get("/api/subject");
  }

  getSubjectsStudent(id) {
    return api.get("/api/subject/" + id + "/students")
  }
  async addSubject(body) {
    try {
      const response = await api.post("/api/subject", body, {
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

export default new SubjectService();
