import express from "express"
import cookieParser from "cookie-parser";
 
import userRouter from './routes/user.routes.js'
import urlsRouter from './routes/urls.routes.js'
 
import { clerkMiddleware } from "@clerk/express";

import cors from 'cors'
const app = express();
const PORT= 8000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://short-link-two-inky.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));



app.use(express.json());
app.use(cookieParser())
 app.use(clerkMiddleware());
app.use('/api/user',userRouter)
app.use('/', urlsRouter)

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT,()=>{
    console.log(`Server listen at http://localhost:${PORT}`)
})