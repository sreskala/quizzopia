import express, { Request, Response } from "express";
import { Game } from "../models/game";
import { QuestionCategory, requireAuth, validateRequest } from "@reskalaware/enigma-essentials";
import { ValidationChain, body } from "express-validator";
import { Question, QuestionDocument } from "../models/question";
import { FilterQuery } from "mongoose";

const router = express.Router();

router.post('/api/trivium/game', requireAuth, async (req: Request, res: Response) => {
    const { amount, category } = req.body;

    const filterQuery: FilterQuery<QuestionDocument> =  category ? { category } : {}
    const questions = await Question.find(filterQuery).exec();

    const shuffledQuestions = Question.randomizeQuestions(questions, amount);

    const game = Game.build({
        userId: (req.currentUser?.id as string),
        questions: shuffledQuestions
    });

    await game.save();

    res.status(201).send(game);
});

export  { router as createQuestionsRouter }