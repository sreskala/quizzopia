import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

// import { currentUserRouter } from './routes/current-user';
// import { loginRouter } from './routes/login';
// import { logoutRouter } from './routes/logout';
// import { signupRouter } from './routes/signup';

// import { errorHandler, NotFoundError } from '@reskalaware/common';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    name: 'auth-session',
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUserRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(signupRouter);

// app.get('*', async (req: Request, res: Response) => {
//    throw new NotFoundError();
// })

// app.use(errorHandler);

export { app };