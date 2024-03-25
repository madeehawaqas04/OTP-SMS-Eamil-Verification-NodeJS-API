import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./routes/auth.js";

const app = express();
dotenv.config();


const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("Connected to mongoDB.");
    } catch (error) {
      throw error;
    }
  };
  
//middlewares
app.use(cors())
//pass the value in form of json
app.use(express.json());

app.use("/api/auth", authRoute);


app.listen(8800, () => {
    connect();
    console.log("Connected to backend.");
  });

  