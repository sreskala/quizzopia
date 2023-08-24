import express, { Request, Response } from "express";
import { NotFoundError } from "@reskalaware/enigma-essentials";
import { Question, QuestionDocument } from "../models/question";
import { FilterQuery } from "mongoose";

const router = express.Router();
const QUESTION_STANDARD_LIMIT = 10;

//get questions for game
router.get('/api/trivium/questions', async (req: Request, res: Response) => {
    const { limit, category } = req.query;
    const queryLimit = limit ? parseInt(limit as string, 10) : QUESTION_STANDARD_LIMIT
    const filterQuery: FilterQuery<QuestionDocument> =  category ? { category } : {}
    const questions = await Question.find(filterQuery).limit(queryLimit).exec();

    res.send(questions);
});

//get a single question
router.get('/api/trivium/questions/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question) {
        throw new NotFoundError();
    }

    res.send(question);
})

export { router as getQuestionsRouter }