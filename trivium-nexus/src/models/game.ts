import mongoose from 'mongoose';
import { QuestionDocument } from './question';

export interface GameAttributes {
    userId: string;
    questions: QuestionDocument[];
}

interface GameModel extends mongoose.Model<GameDocument> {
    build(gameAttributes: GameAttributes): GameDocument;
}

interface GameDocument extends mongoose.Document {
    userId: string;
    questions: QuestionDocument[]
}

const gameSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

gameSchema.statics.build = (gameData: GameAttributes) => {
    return new Game(gameData);
};

const Game = mongoose.model<GameDocument, GameModel>('Game', gameSchema);

export { Game };