import api from "./api";
import TokenService from "./token.service";

export class AuthService {
    login(username, password) {
        return api
            .post("/auth/login", {
                usernameOrEmail: username,
                password: password
            })
            .then(response => {
                if (response.data.access_token) {
                    TokenService.setUser(response.data);
                }
                return response.data;
            })
            .catch((response) => {
                console.log(response);
            });
    }

    logout() {
        TokenService.removeUser();
    }

    register(username, email, password, role, name, lastName) {
        return api.post("/api/users/create", {
            username,
            email,
            password,
            role,
            name,
            lastName
        });
    }

    getCurrentUser() {
        return TokenService.getUser();
    }
}

export default new AuthService();
