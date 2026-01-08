import express from 'express'
import {userInfo} from '../controllers/user.controller'
 
import { getUserUrls } from '../controllers/user.controller';

const router = express.Router();

router.get('/', userInfo)
router.get('/urls', getUserUrls)
export default router;