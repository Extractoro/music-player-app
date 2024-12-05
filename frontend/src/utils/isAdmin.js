import {jwtDecode} from "jwt-decode";

export const isAdmin = () => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    return decoded.role;
}
