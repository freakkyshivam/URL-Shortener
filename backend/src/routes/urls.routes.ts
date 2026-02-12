import express, { Router } from 'express'
import {shortUrl,redirectUrl,  deleteUrl} from '../controllers/urls.controller.js'
import { ensureUser } from '../middlewares/authMiddleware.js';
import { requireAuth } from '@clerk/express';

const router: Router = express.Router();

router.post('/shorten',requireAuth(), ensureUser, shortUrl)
router.delete('/url/:id',requireAuth(), ensureUser, deleteUrl)
router.get("/:shortCode",redirectUrl)

export default router;
