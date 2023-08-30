import { questions } from "./assets/questions";
import { Question, QuestionDocument } from "./models/question"

export const startup = async (): Promise<void> => {
    const currentQuestions = await Question.find();
    const totalQuestionCount = questions.length;

    if (currentQuestions.length === totalQuestionCount) {
        console.log('No new questions to add...');
        return;
    }

    const questionsToAdd = questions.filter(question => {
        const currentQuestionPrompts = currentQuestions.map(q => q.prompt);
        return !currentQuestionPrompts.includes(question.prompt);
    });

    const builtQuestions: QuestionDocument[] = [];
    for (const question of questionsToAdd) {
        builtQuestions.push(Question.build({
            prompt: question.prompt,
            answer: question.answer,
            otherPossibleAnswers: question.otherPossibleAnswers,
            category: question.category
        }));
    }

    console.log(`Adding ${questionsToAdd.length} new questions`);
    await Question.insertMany(builtQuestions);
    console.log('Questions successfuly saved');
    return;
}