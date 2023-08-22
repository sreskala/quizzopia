import { QuestionCategory } from "@reskalaware/enigma-essentials";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface QuestionAttributes {
    prompt: string;
    answer: string;
    category: QuestionCategory;
    otherPossibleAnswers?: string[];
}

interface QuestionDocument extends mongoose.Document {
    prompt: string;
    answer: string;
    category: QuestionCategory;
    otherPossibleAnswers?: string[];
    version: number;
}

interface QuestionModel extends mongoose.Model<QuestionDocument> {
    build(attributes: QuestionAttributes): QuestionDocument;
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

questionSchema.statics.build = (attributes: QuestionAttributes) => {
    return new Question(attributes);
}

const Question = mongoose.model<QuestionDocument, QuestionModel>('Question', questionSchema);

export { Question };