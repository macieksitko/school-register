import api from './api';

class StudentService {
    getStudents() {
        return api.get('/api/student');
    }
}

export default new StudentService();
