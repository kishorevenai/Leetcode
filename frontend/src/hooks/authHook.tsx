import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { selectCurrentToken } from "../feature/auth/authSlice";
import { useSelector } from "react-redux";


interface DecodedToken {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}


export const useAuth = () => {
    const accessToken = useSelector(selectCurrentToken);


    if (accessToken) {
        const { id, name, email, createdAt, updatedAt }: DecodedToken = jwtDecode(accessToken);

        console.log("Decoded token:", { id, name, email, createdAt, updatedAt });
        return {
            id, name, email, createdAt, updatedAt
        };
    }
    return {
        id: "",
        name: "",
        email: "",
        createdAt: "",
        updatedAt: ""
    };
}