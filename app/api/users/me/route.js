// import {connect} from '@/dbConfig/dbConfig'
// import User from '@/models/userModel'
// import {NextRequest, NextResponse} from 'next/server'
// import { getDataFromToken } from '@/helpers/tokenData'

// connect();

// export async function POST(req){
//     // extract data from token
//     const userId = await getDataFromToken(req);
//     // console.log(userId)
//     const user = User.findOne({_id: userId}).select("-password");

//     return NextResponse.json({
//         message: "User found",
//         data: user
//     })
// }
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/tokenData';

connect();

export async function POST(req) {
  try {
    // Extract user ID from token
    const userId = await getDataFromToken(req);

    // Query the user and select everything except the password
    const user = await User.findOne({ _id: userId }).select('-password').lean(); // Use 'await' and 'lean()'

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return the user data
    return NextResponse.json({
      message: 'User found',
      data: user,
    });
  } catch (error) {
    console.error('Error:', error);

    // Handle any unexpected errors
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
