import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import {NextRequest, NextResponse} from 'next/server'
import { getDataFromToken } from '@/helpers/tokenData'

connect();

export async function POST(req){
    // extract data from token
    const userId = await getDataFromToken(req);
    const user = User.findOne({_id: userId}).select("-password");

    return NextResponse.json({
        message: "User found",
        data: user
    })
}