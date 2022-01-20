import axios from "axios";
import TokenService from "./token.service";

const instance = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = TokenService.getLocalAccessToken();
        if (token) {
            config.headers["Authorization"] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// nie przetestowane jeszcze, po dostaniu 401 na dowolnym requescie mozna wylogowac uzytkownika od razu
// instance.interceptors.response.use(
//     (res) => {
//         return res;
//     },
//     async (err) => {
//         const originalConfig = err.config;
//
//         if (err.response) {
//             // Access Token was expired
//             if (err.response.status === 401) {
//                 originalConfig._retry = true;
//                 TokenService.removeUser();
//                 return instance(originalConfig);
//             }
//         }
//
//         return Promise.reject(err);
//     }
// );
export default instance;
