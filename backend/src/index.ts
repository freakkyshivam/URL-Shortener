import express from "express"
import cookieParser from "cookie-parser";
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import urlsRouter from './routes/urls.routes.js'
import {authMiddleware} from './middlewares/authMiddleware.js'
import cors from 'cors'
const app = express();
const PORT= 8000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://short-link-two-inky.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // curl / server-to-server
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));


app.use(express.json());
app.use(cookieParser())

app.use('/api/auth',authRouter)
app.use('/api/user', authMiddleware,userRouter)
app.use('/', urlsRouter)
 

app.listen(PORT,()=>{
    console.log(`Server listen at http://localhost:${PORT}`)
})