import express, { Request, Response } from "express";
import { IQuestion, Question, QuestionDocument } from "../models/question";
import { QuestionCategory, validateRequest } from "@reskalaware/enigma-essentials";
import { ValidationChain, body } from "express-validator";

const router = express.Router();

const validationRules: ValidationChain[] = [
    body("prompt").not().isEmpty().withMessage("Prompt must not be empty"),
    body("answer").not().isEmpty().withMessage("Answer must not be empty"),
    body("category").isIn(Object.values(QuestionCategory)).withMessage("Category must be one of the valid categories")
]

router.post('/api/trivium/questions', validationRules, validateRequest, async (req: Request, res: Response) => {
    //This is an array
    const { questions } = req.body;

    const builtQuestions: QuestionDocument[] = []
    for (const questionInput of questions) {
        const { prompt, answer, category, otherPossibleAnswers } = questionInput;
        builtQuestions.push(Question.build({ prompt, answer, category, otherPossibleAnswers }));
    }
    await Question.insertMany(builtQuestions);
    
    res.status(201).send({ questions: builtQuestions.map(question => question.prompt )});
});

export  { router as createQuestionsRouter }