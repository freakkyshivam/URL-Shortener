import express, { Router } from 'express'
import {shortUrl,redirectUrl,  deleteUrl} from '../controllers/urls.controller.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router: Router = express.Router();

router.post('/shorten',authMiddleware, shortUrl)
router.delete('/url/:id', authMiddleware, deleteUrl)
router.get("/:shortCode",redirectUrl)

export default router;
