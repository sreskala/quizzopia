import express, { Request, Response } from "express";
import { Question } from "../models/question";
import { QuestionCategory, validateRequest } from "@reskalaware/enigma-essentials";
import { ValidationChain, body } from "express-validator";

const router = express.Router();

const validationRules: ValidationChain[] = [
    body("prompt").not().isEmpty().withMessage("Prompt must not be empty"),
    body("answer").not().isEmpty().withMessage("Answer must not be empty"),
    body("category").isIn(Object.values(QuestionCategory)).withMessage("Category must be one of the valid categories")
]

router.post('/api/trivium/questions', validationRules, validateRequest, async (req: Request, res: Response) => {
    const { prompt, answer, category } = req.body;

    const question = Question.build({ prompt, answer, category });
    await question.save();
    
    res.status(201).send(question)
});

export  { router as createQuestionsRouter }