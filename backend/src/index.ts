import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import type { Request,Response } from "express";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=>console.log("Connected to DB"));

const app = express();
app.use(express.json());
app.use(cors());
app.get("/test",async(req: Request,res: Response)=>{
    res.json({message:"Hello"});
});
app.listen(7000,()=>{
   console.log("server started on localhost:7000 ");
});
