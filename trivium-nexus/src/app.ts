import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@reskalaware/enigma-essentials';
import { getQuestionsRouter } from './routes/get-questions';
import { createQuestionsRouter } from './routes/new-question';
// import { createTicketRouter } from './routes/new';
// import { showTicketRouter } from './routes/show';
// import { updateTicketRouter } from './routes/update';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    name: 'auth-session',
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUser);

app.use(getQuestionsRouter);
app.use(createQuestionsRouter);
// app.use(createTicketRouter);
// app.use(showTicketRouter);
// app.use(updateTicketRouter)

app.get('*', async (req: Request, res: Response) => {
   throw new NotFoundError();
})

app.use(errorHandler);

export { app };