import express, { Request, Response } from 'express';
import { ValidationChain, body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

import { validateRequest, BadRequestError } from '@reskalaware/common';

const router = express.Router();
const validationRules: ValidationChain[] = [
    body('email')
    .isEmail()
    .withMessage('Email must be valid'),
    body('password')
    .trim()
    .isLength({ min: 8, max: 25 })
    .withMessage('Password must be between 4 and 20 characters')
]

router.post('/api/users/signup', validationRules, validateRequest ,async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser  = await User.findOne({ email });

    if (existingUser) {
        throw new BadRequestError('Email already in use')
    }

    const user = User.build({ email, password });
    await user.save();

    //generate jwt
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY as string)

    //store it on session object
    req.session = {
        jwt: userJwt
    }

    res.status(201).send(user)
});

export { router as signupRouter }