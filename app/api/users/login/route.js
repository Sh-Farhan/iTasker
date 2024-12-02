// import {connect} from '@/dbConfig/dbConfig'
// import User from '@/models/userModel'
// import {NextResponse} from 'next/server'
// import bcrypt from 'bcryptjs/dist/bcrypt' 
// import jwt from "jsonwebtoken" 
// import mongoose from 'mongoose';

// connect();

// export async function POST(req){
//     try {
//         const reqBody = await req.json();
//         const {email,password} = reqBody;

//         console.log(reqBody);

//         const db = mongoose.connection.useDb('iTasker-userdata');


//         const user = await User.findOne({email})
//         console.log(user)

//         if(!user){
//             return NextResponse.json({error: "User does not exist"}, {status: 400})
//         }
//         console.log("User exists");

//         const validPassword = await bcrypt.compare(password,user.password)

//         if(!validPassword){
//             return NextResponse.json({error: "Check your credentials"}, {status: 400})
//         }

//         const tokenData = {
//             id: user._id,
//             username: user.username,
//             email: user.email
//         }

//         const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: '1d'})

//         const res = NextResponse.json({
//             message: "Logged in Successfully",
//             success: true
//         })

//         res.cookies.set("token",token, {
//             httpOnly: true
//         })

//         return res


//     } catch (error) {
//         return NextResponse.json({error: error.message},
//             {status: 500}
//         )
//     }
// }


import { connect } from '@/dbConfig/dbConfig';
import { userSchema } from '@/models/userModel';
import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs'; // Use bcryptjs
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Connect to the database
connect();

export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;

    console.log("Request body:", reqBody);

    // Switch the connection to the specific database
    const db = mongoose.connection.useDb('iTasker-userdata');  // Use specific database
    const User = db.model('users', userSchema); // Bind the User model to this database

    // Query the user using the existing User model bound to the correct DB
    const user = await User.findOne({ email });
    console.log("Queried email:", email);
    console.log("User from database:", user);

    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }
    console.log("User exists, proceeding to password validation.");

    // Validate password using bcryptjs
    const validPassword = await bcryptjs.compare(password, user.password);
    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", user.password);
    console.log("Password validation result:", validPassword);

    if (!validPassword) {
      return NextResponse.json({ error: "Check your credentials" }, { status: 400 });
    }

    console.log("Password is valid. Creating token.");

    // Generate JWT token
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: '1d' });

    console.log("Token generated:", token);

    // Create the response with a token
    const res = NextResponse.json({
      message: "Logged in Successfully",
      success: true,
    });

    res.cookies.set("token", token, {
      httpOnly: true,
    });

    console.log("Response with token ready.");
    return res;
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
