import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
export const dynamic = 'force-static'

const url =  process.env.MONGODB_URI;
const client = new MongoClient(url)

const dbName = 'pass-manager-user-db'

export const GET = async () => {
    try{
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('userData');
        const Result = await collection.find({}).toArray();
        const data = await JSON.stringify(Result)
        return new NextResponse(data)
    } catch(error){
        return new NextResponse("Error in fetching users" + error.message)
    }
}

export const POST = async (req,res) => {
    try {
        const data = await req.json();
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('userData');
        const insertResult = await collection.insertOne(data);  // Insert the body (password data)

        return NextResponse.json({ success: true, result: insertResult });  // Return the result as JSON
    } catch (error) {
        return new NextResponse("Error inserting data: " + error.message);
    } finally {
        await client.close();  // Ensure the client is closed after the operation
    }
};

export const DELETE = async(req,res) => {
    try{
        const data = await req.json();
        console.log(data);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('userData');
        const Result = await collection.deleteOne(data);
        return NextResponse.json({succes : true, result: Result,myDel: data})
    } catch(error){
        return new NextResponse("Error inserting data: " + error.message);
    } finally{
        await client.close();
    }
}

 