// import { NextRequest } from "next/server";
// import jwt from "jsonwebtoken"

// export const getDataFromToken = (req) => {
//     try {
//         const Token = req.cookies.get("token").value || "";
//         console.log(Token)

//         const decodedToken = jwt.verify(Token, process.env.TOKEN_SECRET);

//         return decodedToken.id
//     } catch (error) {
//         throw new Error(error.message)
//     }
// }
// In helpers\tokenData.js

import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {
        // Corrected line using optional chaining (?.)
        const token = request.cookies.get("token")?.value || "";

        if (!token) {
            throw new Error("No token found in cookies");
        }

        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
        return decodedToken.id;

    } catch (error: any) {
        // It's good practice to log the original error for debugging
        console.error("Token processing error:", error.message);
        throw new Error("Invalid or missing authentication token.");
    }
}