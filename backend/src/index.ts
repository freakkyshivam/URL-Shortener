import express from "express"
import cookieParser from "cookie-parser";
import authRouter from './routes/auth.routes'
import userRouter from './routes/user.routes'
import urlsRouter from './routes/urls.routes'
import {authMiddleware} from './middlewares/authMiddleware'
import cors from 'cors'
const app = express();
const PORT= 8000;

app.use(cors({
    origin : [
        'http://localhost:5173'
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