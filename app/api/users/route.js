// import { NextResponse } from "next/server";
// import { MongoClient } from "mongodb";
// import jwt from "jsonwebtoken";
// import { ObjectId } from "mongodb";

// const url = process.env.MONGODB_URI;
// const client = new MongoClient(url);
// const dbName = "iTasker-todos";

// let cachedClient = null;

// async function connectToDatabase() {
//     if(!cachedClient){
//         await client.connect();
//         cachedClient = client;
//     }

//     return cachedClient.db(dbName);
// }

// export const GET = async(req) => {
//     try {
//         const token = req.cookies.get("token")?.value || "";
//         const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
//         console.log(decodedToken)

//         if(!token){
//             return NextResponse.json(
//               {error: 'Not authenticated'}
//             )
//           }
      
//           const user = decodedToken.username
      
          
//           if (!user) {
//             return NextResponse.json(
//               { error: 'User parameter is required' },
//               { status: 400 }
//             );
//           }

//           const db = await connectToDatabase();
//           const collection = db.collection(user)
//           const result = await collection.find({}).toArray();

//           return NextResponse.json(result, {status: 200});
//     } catch (error) {
//         console.log("Error fetching users", error);
//         return NextResponse.json(
//             {error: "Error in fetching users: " + error.message},
//             {status: 500}
//         )
//     }
// }

// // export const POST = async (req) => {
// //   try {
// //     const token = req.cookies.get("token")?.value || ""; 
// //     const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
// //     console.log(decodedToken)

// //     if(!token){
// //       return NextResponse.json(
// //         {error: 'Not authenticated'}
// //       )
// //     }
    
// //     const user = decodedToken.username;

// //     const data = await req.json();
// //     console.log("user is the query is")

// //     console.log(data)


// //     const db = await connectToDatabase(); 
// //     const collection = db.collection(user);
// //     const result = await collection.insertOne(data);

// //     return NextResponse.json(result, { status: 200 });
// //   } catch (error) {
// //     console.log('Error fetching users:', error);
// //     return NextResponse.json(
// //       { error: 'Error in fetching users: ' + error.message },
// //       { status: 500 }
// //     );
// //   }
// // };
// export const POST = async (req) => {
//   try {
//     const token = req.cookies.get("token")?.value || "";
//     if (!token) {
//       return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
//     }

//     const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
//     const user = decodedToken.username;

//     const data = await req.json();

//     const db = await connectToDatabase();
//     const collection = db.collection(user);
//     const result = await collection.insertOne(data);

//     // ✅ Create a full task object to return
//     const insertedTask = {
//       ...data,
//       id: result.insertedId.toString(), // Make sure it's a string for draggableId
//     };

//     return NextResponse.json(insertedTask, { status: 200 });
//   } catch (error) {
//     console.error('Error inserting task:', error);
//     return NextResponse.json(
//       { error: 'Error inserting task: ' + error.message },
//       { status: 500 }
//     );
//   }
// };

// export const DELETE = async(req) => {
//   try {
//     const token = req.cookies.get("token")?.value || "";
//     const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
//     console.log(decodedToken);

//     if(!token){
//       return NextResponse.json({
//         error : "Not authenticated"
//       })
//     }

//     const user = decodedToken.username;

//     const data =  req.json();
//     console.log("user is the query is")

//     console.log(data)


//     const db = await connectToDatabase(); 
//     const collection = db.collection(user);
//     const result = await collection.deleteOne(data);

//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     console.log('Error fetching users:', error);
//     return NextResponse.json(
//       { error: 'Error in fetching users: ' + error.message },
//       { status: 500 }
//     );
//   }
// }

// // const updateDocumentbyId = async (collection, data) => {
// //   try {
// //     const id = new ObjectId(data._id);

// //     const result = await collection.updateOne(
// //       {_id: id},
// //       {
// //         $set: {
// //           // your data to be updated
// //           todo: data.todo,
// //           status: data.status
// //         },
// //       }
// //     )

// //     return {
// //       matchedCount: result.matchedCount,
// //       modifiedCount: result.modifiedCount,
// //     };
// //   } catch (error) {
// //     console.log("Error updating document: ", error);
// //     throw new Error("Update failed");
// //   }
// // }

// // export const PUT = async(req) => {
// //   try {
// //     const token = req.cookies.get("token")?.value || "";
// //     const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

// //     console.log(decodedToken);

// //     if(!token){
// //       return NextResponse.json({error : "Not authenticated"});
// //     }

// //     const user = decodedToken.username;
// //     const data = await req.json();
// //     console.log(data);

// //     const db = await connectToDatabase();
// //     const collection = db.collection(user);

// //     const result = await updateDocumentbyId(collection, data);

// //     return NextResponse.json(result, {status: 200});
// //   } catch (error) {
// //     console.log(error.message);

// //     return NextResponse.json(
// //       {error: "Error in fetching users: " + error.message},
// //       {status: 500},
// //     )
// //   }
// // }
// const updateDocumentbyId = async (collection, data) => {
//   try {
//     const id = new ObjectId(data._id); // Ensure this is the correct ID format

//     const result = await collection.updateOne(
//       { _id: id },
//       {
//         $set: {
//           todo: data.todo,
//           status: data.status,
//         },
//       }
//     );

//     console.log("Update result:", result);
//     return {
//       matchedCount: result.matchedCount,
//       modifiedCount: result.modifiedCount,
//     };
//   } catch (error) {
//     console.log("Error updating document: ", error);
//     throw new Error("Update failed");
//   }
// };

// export const PUT = async (req) => {
//   try {
//     const token = req.cookies.get("token")?.value || "";
//     if (!token) {
//       return NextResponse.json({ error: "Not authenticated" });
//     }

//     const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
//     console.log("Decoded Token: ", decodedToken);

//     const user = decodedToken.username;
//     const data = await req.json();
//     console.log("Data received from frontend:", data);

//     const db = await connectToDatabase();
//     const collection = db.collection(user);

//     const result = await updateDocumentbyId(collection, data);

//     console.log("Update Result:", result);
//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     console.log("Error:", error.message);
//     return NextResponse.json(
//       { error: "Error in updating task: " + error.message },
//       { status: 500 }
//     );
//   }
// };



// here


import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

// Ensure MONGODB_URI and TOKEN_SECRET are set in your .env file
const MONGODB_URI = process.env.MONGODB_URI;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}
if (!TOKEN_SECRET) {
  throw new Error(
    "Please define the TOKEN_SECRET environment variable inside .env.local"
  );
}

/**
 * @type {import('mongodb').MongoClient | null}
 */
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient.db("iTasker-todos");
  }
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client.db("iTasker-todos");
}

// Helper function to verify token and get username
const getUserFromToken = (req) => {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return null;
  }
  try {
    const decodedToken = jwt.verify(token, TOKEN_SECRET);
    return decodedToken.username;
  } catch (error) {
    // This will catch invalid/expired tokens
    return null;
  }
};

// GET all tasks for the logged-in user
export const GET = async (req) => {
  try {
    const username = getUserFromToken(req);
    if (!username) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    const db = await connectToDatabase();
    const collection = db.collection(username);
    const tasks = await collection.find({}).toArray();

    // ✅ Map MongoDB's _id to id for frontend consistency
    const formattedTasks = tasks.map(task => ({
        ...task,
        id: task._id.toString(), // Convert ObjectId to string
        _id: undefined, // Remove the original _id
    }));

    return NextResponse.json(formattedTasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

// POST a new task
export const POST = async (req) => {
  try {
    const username = getUserFromToken(req);
    if (!username) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    const { content, status } = await req.json();
    if (!content || !status) {
        return NextResponse.json({ error: "Content and status are required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection(username);
    
    const newTask = { content, status };
    const result = await collection.insertOne(newTask);

    return NextResponse.json({
        ...newTask,
        id: result.insertedId.toString(),
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

// PUT (update) an existing task
export const PUT = async (req) => {
  try {
    const username = getUserFromToken(req);
    if (!username) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    const { id, content, status } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection(username);
    
    const updateFields = {};
    if (content) updateFields.content = content;
    if (status) updateFields.status = status;

    if (Object.keys(updateFields).length === 0) {
        return NextResponse.json({ error: "No fields to update provided" }, { status: 400 });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    // Handle cases where the ID format is invalid
    if (error.name === 'BSONError') {
        return NextResponse.json({ error: "Invalid Task ID format" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};


// DELETE a task
export const DELETE = async (req) => {
  try {
    const username = getUserFromToken(req);
    if (!username) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    // ✅ Correctly get the ID from the request body
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection(username);

    // ✅ Use the ID to create a correct ObjectId for deletion
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    if (error.name === 'BSONError') {
        return NextResponse.json({ error: "Invalid Task ID format" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
