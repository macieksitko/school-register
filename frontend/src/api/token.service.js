import jwt_decode from 'jwt-decode';

const getLocalAccessToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.access_token;
};

const updateLocalAccessToken = (token) => {
    let user = JSON.parse(localStorage.getItem("user"));
    user.access_token = token;
    localStorage.setItem("user", JSON.stringify(user));
};

const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const setUser = ({ access_token }) => {
    const jwtPayload = jwt_decode(access_token);
    localStorage.setItem("user", JSON.stringify({ access_token, user: jwtPayload }));
};

const removeUser = () => {
    localStorage.removeItem("user");
};

const getRole = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.user.role;
}

const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.user.sub;
}

const TokenService = {
    getLocalAccessToken,
    updateLocalAccessToken,
    getUser,
    setUser,
    removeUser,
    getRole,
    getUserId
};

export default TokenService;