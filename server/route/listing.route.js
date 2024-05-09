import express from 'express';
import {create} from '../controller/list.controller.js';
import { deleteListing } from '../controller/list.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { getListing } from '../controller/list.controller.js';
import {updateListing} from '../controller/list.controller.js';
const router  = express.Router();
router.post('/create',verifyToken,create);
router.delete('/delete/:id', verifyToken, deleteListing);

router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
export default router;