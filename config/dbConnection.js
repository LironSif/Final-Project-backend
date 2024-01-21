import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_URI);
    console.log(
      `Database connected: ${connect.connection.host}, Database name: ${connect.connection.name}`
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDb;

// needed???????
// const db = await mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });