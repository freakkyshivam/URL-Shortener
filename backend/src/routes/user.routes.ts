import express, { Router } from 'express'
import {userInfo} from '../controllers/user.controller.js'
 
import { getUserUrls } from '../controllers/user.controller.js';

const router: Router = express.Router();

router.get('/', userInfo)
router.get('/urls', getUserUrls)
export default router;