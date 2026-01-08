import express from 'express'
import {shortUrl,redirectUrl,  deleteUrl} from '../controllers/urls.controller'
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/shorten',authMiddleware, shortUrl)
router.delete('/url/:id', authMiddleware, deleteUrl)
router.get("/:shortCode",redirectUrl)

export default router;
