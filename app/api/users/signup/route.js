
import { connect } from '@/dbConfig/dbConfig';
import mongoose from 'mongoose';
import { userSchema } from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs/dist/bcrypt';
import { sendEmail } from '@/helpers/mailer';

// Establish initial connection
connect();

export async function POST(req) {
    try {
        const reqBody = await req.json();
        const { username, email, password } = reqBody;

        console.log(reqBody);

        // Dynamically use 'iTasker-userdata' database
        const db = mongoose.connection.useDb('iTasker-userdata');
        const User = db.model('users', userSchema); // Rebind schema to the specific database

        // Check if the user already exists
        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ error: "User already exists!" }, { status: 400 });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save the user in the database
        const savedUser = await newUser.save();
        console.log(savedUser);

        // Send verification email
        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

        return NextResponse.json({
            message: "User registered successfully",
            success: true,
            savedUser,
        });
    } catch (error) {
        console.error('Error in user registration:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
