import api from "./api";

export const signin = async (username: string, password: string) => {
    return api.post('/auth/signin', {username, password});
}

export const signup = async (username: string, password: string) => {
    return api.post('/auth/signup', {username, password});
}

export const logout = async () => {
    return api.post('/auth/signout');
}
