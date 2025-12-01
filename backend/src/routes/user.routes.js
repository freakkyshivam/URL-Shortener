import express from 'express'
import {userInfo} from '../controllers/user.controller'
import {authMiddleware} from '../middlewares/authMiddleware'

const router = express.Router();

router.get('/', authMiddleware, userInfo)

export default router;