import mongoose from 'mongoose';
import dns from 'dns';

// Fix Windows-only Node.js querySrv ECONNREFUSED with MongoDB Atlas SRV URIs
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (_) {}
}

const ATLAS_URI = 'mongodb+srv://saillavenu012_db_user:RGdUbOVx1HxpLo0R@cluster0.qjpviol.mongodb.net/srirama_cycles?retryWrites=true&w=majority&appName=Cluster0';
const PRIMARY_URI = process.env.MONGODB_URI || ATLAS_URI;
const LOCAL_FALLBACK_URI = 'mongodb://127.0.0.1:27017/srirama_cycles';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

async function connectToDatabase() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: isProduction ? 1500 : 5000,
      connectTimeoutMS: isProduction ? 1500 : 5000,
    };

    cached.promise = mongoose
      .connect(PRIMARY_URI, opts)
      .then((instance) => {
        console.log('✅ Connected to MongoDB Primary successfully');
        return instance;
      })
      .catch(async (primaryErr) => {
        console.warn(`⚠️ Primary MongoDB connection failed (${primaryErr.message}).`);
        // Only try local MongoDB fallback in local development, never in cloud/production
        if (!isProduction && PRIMARY_URI !== LOCAL_FALLBACK_URI) {
          try {
            console.log('Attempting local MongoDB fallback...');
            const fallbackInstance = await mongoose.connect(LOCAL_FALLBACK_URI, {
              bufferCommands: false,
              serverSelectionTimeoutMS: 2000,
            });
            console.log('✅ Connected to Local MongoDB fallback database');
            return fallbackInstance;
          } catch (fallbackErr) {
            console.error('❌ Local MongoDB fallback also failed:', fallbackErr.message);
            throw primaryErr;
          }
        }
        throw primaryErr;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
