import express from 'express';
import { test } from '../controller/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

import { deleteUser } from '../controller/user.controller.js';
import { updateUser } from '../controller/user.controller.js';

import { getUserListing } from '../controller/user.controller.js';
import { logout } from '../controller/user.controller.js';
const router  = express.Router();

router.get('/test',test);
router.post('/update/:id',verifyToken,updateUser);
router.delete('/delete/:id',verifyToken,deleteUser);
router.get('/listing/:id',verifyToken,getUserListing);
router.get('/logout',logout);


export default router;