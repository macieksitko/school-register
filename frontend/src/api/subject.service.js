import api from "./api";

class SubjectService {
  getSubjects() {
    return api.get("/api/subject");
  }

  getSubjectsStudent(id) {
    return api.get("/api/subject/" + id + "/students");
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

  async addStudents(subjectId, body) {
    try {
      const response = await api.post(`/api/subject/${subjectId}/students`, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.status === 201;
    } catch (error) {
      return error.response.data.message;
    }
  }

  async generateReport(subjectId) {
    try{
      const response = await api.post(`/api/reports`, {subjectId}, { headers: { 'Content-Type': 'application/json' } });
      return response;
    }catch(error) {
      return error.response.data;
    }
  }
}

export default new SubjectService();
