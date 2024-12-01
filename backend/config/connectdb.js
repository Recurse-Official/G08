import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Connecting to database:', process.env.DATABASE_URL); // Debug log
    const connection = await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB connected:', connection.connection.host);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit with failure
  }
};



export default connectDB;