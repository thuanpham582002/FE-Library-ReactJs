import AuthService from "../../../services/auth.service";
import React, {useEffect} from "react";
import {BookDetailAdmin} from "./BookDetailAdmin";

import {useNavigate} from "react-router-dom";
import {BookDetailUser} from "./BookDetailUser";

export const BookDetail = () => {
    const user = AuthService.getCurrentUser();

    if (user && user.roles.includes("admin")) {
        return <BookDetailAdmin/>
    } else {
        return <BookDetailUser/>
    }
}