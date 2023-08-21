import express, { Request, Response } from 'express';
import { ValidationChain, body } from 'express-validator';
import { User } from '../models/user';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken'

//import { validateRequest, BadRequestError } from '@reskalaware/common';

const router = express.Router();

const validationRules: ValidationChain[] = [
    body('email')
    .isEmail()
    .withMessage('Email must be valid'),
    body('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('You must supply a password')
]

router.post('/api/users/login', validationRules, validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    // if (!existingUser) {
    //     throw new BadRequestError('Invalid credentials');
    // }

    const passwordsMatch = await Password.compare(existingUser.password, password);

    // if (!passwordsMatch) {
    //     throw new BadRequestError('Invalid credentials');
    // }

    //generate jwt
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY as string)

    //store it on session object
    req.session = {
        jwt: userJwt
    }

    res.status(200).send(existingUser)
});

export { router as loginRouter }