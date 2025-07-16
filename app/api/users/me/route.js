import { MongoClient, ObjectId } from 'mongodb';
import { getDataFromToken } from '@/helpers/tokenData';
import { NextResponse } from 'next/server';

const MONGO_URI = process.env.MONGODB_URI; // ✅ use correct env var
const dbName = 'iTasker-userdata';

let cachedClient = null;

async function connectToDatabase() {
  if (!cachedClient) {
    if (!MONGO_URI) {
      throw new Error('MONGODB_URI is undefined. Please check your .env.local');
    }

    cachedClient = new MongoClient(MONGO_URI);
    await cachedClient.connect();
  }

  return cachedClient.db(dbName);
}

export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const userId = await getDataFromToken(req);

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User found', data: user });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
