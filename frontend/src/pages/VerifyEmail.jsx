import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {verifyEmail} from "../api/auth.js";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            verifyEmail(token)
                .then(() => {
                    toast.success("Email successfully verified!", { theme: "dark" });
                    navigate("/signin");
                })
                .catch((error) => {
                    toast.error(error.message || "Invalid or expired token.", {
                        theme: "dark",
                    });
                    navigate("/signup");
                })
                .finally(() => setLoading(false));
        } else {
            toast.error("Token not provided.", { theme: "dark" });
            navigate("/signup");
        }
    }, [searchParams, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return null;
};

export default VerifyEmail;
