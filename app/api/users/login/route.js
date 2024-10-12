import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import {NextRequest, NextResponse} from 'next/server'
import bcrypt from 'bcryptjs/dist/bcrypt' 
import jwt from "jsonwebtoken" 

connect();

export async function POST(req){
    try {
        const reqBody = await req.json();
        const {email,password} = reqBody;

        console.log(reqBody);

        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        console.log("User exists");

        const validPassword = await bcrypt.compare(password,user.password)

        if(!validPassword){
            return NextResponse.json({error: "Check your credentials"}, {status: 400})
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: '1d'})

        const res = NextResponse.json({
            message: "Logged in Successfully",
            success: true
        })

        res.cookies.set("token",token, {
            httpOnly: true
        })

        return res


    } catch (error) {
        return NextResponse.json({error: error.message},
            {status: 500}
        )
    }
}