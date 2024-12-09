import {jwtDecode} from "jwt-decode";

export const getUserId = () => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    return decoded.user_id;
}
