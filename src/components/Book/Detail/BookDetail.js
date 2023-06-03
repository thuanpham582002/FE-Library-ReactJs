import AuthService from "../../../services/auth.service";
import React, {useEffect} from "react";
import {BookDetailAdmin} from "./BookDetailAdmin";

import {useNavigate} from "react-router-dom";
import {BookDetailUser} from "./BookDetailUser";

export const BookDetail = () => {
    const user = AuthService.getCurrentUser();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    });

    if (user.roles.includes("admin")) {
        return <BookDetailAdmin/>
    } else {
        return <BookDetailUser/>
    }
}