import api from './api';

class StudentService {
    getStudents() {
        return api.get('/api/student');
    }

    getStudent(id) {
        return api.get('/api/student/' + id);
    }

    addStudentMark(studentId, payload) {
        return api.post('/api/student/' + studentId + '/mark', payload);
    }
}

export default new StudentService();
