import express from "express"
import cookieParser from "cookie-parser";
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import urlsRouter from './routes/urls.routes.js'
import {authMiddleware} from './middlewares/authMiddleware.js'
import cors from 'cors'
const app = express();
const PORT= 8000;

app.use(cors({
    origin : [
        'http://localhost:5173',
        'https://short-link-two-inky.vercel.app'
    ],
    credentials : true
}))

app.use(express.json());
app.use(cookieParser())

app.use('/api/auth',authRouter)
app.use('/api/user', authMiddleware,userRouter)
app.use('/', urlsRouter)
 

app.listen(PORT,()=>{
    console.log(`Server listen at http://localhost:${PORT}`)
})