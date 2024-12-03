import {logoutUser} from "../api/auth.js";
import {toast} from "react-toastify";

export const handleLogout = async () => {
    try {
        const response = await logoutUser();
        toast.success(response.message || "Logout successfully!", {
            theme: "dark",
        });
    } catch (error) {
        toast.error(error.message || "Failed to logout.", {
            theme: "dark",
        });
    }
};