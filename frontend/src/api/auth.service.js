import jwt_decode from 'jwt-decode';

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
                const jwtPayload = response.data?.access_token ? jwt_decode(response.data.access_token) : '';
                if (jwtPayload) {
                    TokenService.setUser({...response.data, user: jwtPayload});
                }
                return {
                    ...response.data,
                    user: jwtPayload
                };
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
