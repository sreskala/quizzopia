import { QuestionCategory } from "@reskalaware/enigma-essentials";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface IQuestion {
    prompt: string;
    answer: string;
    category: QuestionCategory;
    otherPossibleAnswers?: string[];
}

export interface QuestionDocument extends mongoose.Document {
    prompt: string;
    answer: string;
    category: QuestionCategory;
    otherPossibleAnswers?: string[];
    version: number;
}

interface QuestionModel extends mongoose.Model<QuestionDocument> {
    build(attributes: IQuestion): QuestionDocument;
    randomizeQuestions(questions: IQuestion[], amount: number): IQuestion[]
}

const questionSchema = new mongoose.Schema({
    prompt: {
        type: String,
        required: true 
    },
    answer: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: Object.values(QuestionCategory)
    },
    otherPossibleAnswers: [{ type: String }]
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
questionSchema.set('versionKey', 'version');
questionSchema.plugin(updateIfCurrentPlugin);

const shuffle = <T>(array: T[]) => { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array; 
};

questionSchema.statics.build = (attributes: IQuestion) => {
    return new Question(attributes);
}

questionSchema.statics.randomizeQuestions = (questions: IQuestion[], amount = 10) => {
    const shuffledQuestions = shuffle<IQuestion>(questions);
    return shuffledQuestions.slice(0, amount);
}

const Question = mongoose.model<QuestionDocument, QuestionModel>('Question', questionSchema);

export { Question };