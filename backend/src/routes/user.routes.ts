import express, { Router } from 'express';

import { userInfo, getUserUrls } from '../controllers/user.controller.js';

import { requireAuth } from "@clerk/express";
import { ensureUser } from '../middlewares/authMiddleware.js';

const router: Router = express.Router();

 
router.use(requireAuth());
router.use(ensureUser);

router.get('/', userInfo);
router.get('/urls', getUserUrls);

export default router;
