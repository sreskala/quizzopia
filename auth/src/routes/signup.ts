import express, { Request, Response } from 'express';
import { ValidationChain, body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

import { validateRequest, BadRequestError } from '@reskalaware/enigma-essentials';

const router = express.Router();
const validationRules: ValidationChain[] = [
    body('email')
    .isEmail()
    .withMessage('Email must be valid'),
    body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
]

router.post('/api/users/signup', validationRules, validateRequest ,async (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    const existingUserEmail  = await User.findOne({ email });
    const existingUserName = await User.findOne({ username });

    if (existingUserEmail) {
        throw new BadRequestError('Email already in use')
    }

    if (existingUserName) {
        throw new BadRequestError('Username already in use')
    }

    const user = User.build({ email, password, username });
    await user.save();

    //generate jwt
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email,
        username: username ?? undefined
    }, process.env.JWT_KEY as string)

    //store it on session object
    req.session = {
        jwt: userJwt
    }

    res.status(201).send(user)
});

export { router as signupRouter }