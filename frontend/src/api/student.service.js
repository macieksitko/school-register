import api from './api';

class StudentService {
    getStudents() {
        return api.get('/api/student');
    }

    getStudent(id) {
        return api.get('/api/student/' + id);
    }
}

export default new StudentService();
