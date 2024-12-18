import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
const dbName = "iTasker-todos";

let cachedClient = null;

async function connectToDatabase() {
    if(!cachedClient){
        await client.connect();
        cachedClient = client;
    }

    return cachedClient.db(dbName);
}

export const GET = async(req) => {
    try {
        const token = req.cookies.get("token")?.value || "";
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(decodedToken)

        if(!token){
            return NextResponse.json(
              {error: 'Not authenticated'}
            )
          }
      
          const user = decodedToken.username
      
          
          if (!user) {
            return NextResponse.json(
              { error: 'User parameter is required' },
              { status: 400 }
            );
          }

          const db = await connectToDatabase();
          const collection = db.collection(user)
          const result = await collection.find({}).toArray();

          return NextResponse.json(result, {status: 200});
    } catch (error) {
        console.log("Error fetching users", error);
        return NextResponse.json(
            {error: "Error in fetching users: " + error.message},
            {status: 500}
        )
    }
}

export const POST = async (req) => {
  try {
    const token = req.cookies.get("token")?.value || ""; 
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(decodedToken)

    if(!token){
      return NextResponse.json(
        {error: 'Not authenticated'}
      )
    }
    
    const user = decodedToken.username;

    const data = await req.json();
    console.log("user is the query is")

    console.log(data)


    const db = await connectToDatabase(); 
    const collection = db.collection(user);
    const result = await collection.insertOne(data);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Error in fetching users: ' + error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async(req) => {
  try {
    const token = req.cookies.get("token")?.value || "";
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(decodedToken);

    if(!token){
      return NextResponse.json({
        error : "Not authenticated"
      })
    }

    const user = decodedToken.username;

    const data = await req.json();
    console.log("user is the query is")

    console.log(data)


    const db = await connectToDatabase(); 
    const collection = db.collection(user);
    const result = await collection.deleteOne(data);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Error in fetching users: ' + error.message },
      { status: 500 }
    );
  }
}

const updateDocumentbyId = async (collection, data) => {
  try {
    const id = new ObjectId(data._id);

    const result = await collection.updateOne(
      {_id: id},
      {
        $set: {
          // your data to be updated
        },
      }
    )

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  } catch (error) {
    console.log("Error updating document: ", error);
    throw new Error("Update failed");
  }
}

export const PUT = async(req) => {
  try {
    const token = req.cookies.get("token")?.value || "";
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    console.log(decodedToken);

    if(!token){
      return NextResponse.json({error : "Not authenticated"});
    }

    const user = decodedToken.username;
    const data = await req.json();
    console.log(data);

    const db = await connectToDatabase();
    const collection = db.collection(user);

    const result = await updateDocumentbyId(collection, data);

    return NextResponse.json(result, {status: 200});
  } catch (error) {
    console.log(error.message);

    return NextResponse.json(
      {error: "Error in fetching users: " + error.message},
      {status: 500},
    )
  }
}