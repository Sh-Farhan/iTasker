import { NextRequest } from "next/server";
import jwt from "jsonwebtoken"

export const getDataFromToken = (req) => {
    try {
        const Token = req.cookies.get("token").value || "";
        console.log(Token)

        const decodedToken = jwt.verify(Token, process.env.TOKEN_SECRET);

        return decodedToken.id
    } catch (error) {
        throw new Error(error.message)
    }
}