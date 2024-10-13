import mongoose from 'mongoose';

/**
 * Connects to the MongoDB database using the connection string from environment variables.
 */
const connectDb = async (): Promise<void> => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING as string);

    console.log(
      `MongoDB connected: ${connect.connection.host}, Database: ${connect.connection.name}`
    );
  } catch (err) {
    console.error('Error in MongoDB connection:', err);
    process.exit(1); // Exit process with failure
  }
};

export default connectDb;
