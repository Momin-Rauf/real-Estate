import express from 'express';
import {create} from '../controller/list.controller.js';
import { deleteListing } from '../controller/list.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router  = express.Router();
router.post('/create',verifyToken,create);
router.delete('/delete/:id', verifyToken, deleteListing);
export default router;