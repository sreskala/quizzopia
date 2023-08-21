import express from 'express';
import jwt from 'jsonwebtoken';

//import { currentUser } from '@reskalaware/common'

const router = express.Router();

router.get('/api/users/currentuser', /*currentUser,*/ (req, res) => {
    //res.send({ currentUser: req.currentUser || null });
    res.send({})
});

export { router as currentUserRouter }