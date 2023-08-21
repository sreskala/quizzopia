import mongoose from "mongoose";
import { Password } from "../utils/password";

interface IUser {
    email: string;
    username: string;
    password: string;
    friends?: IUser[];
}

interface UserModel extends mongoose.Model<UserDocument> {
    build(userData: IUser): UserDocument
}

interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
    username?: string;
    friends?: UserDocument[]
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashedPassword = await Password.toHash(this.get('password'));
        this.set('password', hashedPassword);
    }

    done();
});

userSchema.statics.build = (userData: IUser) => {
    return new User(userData);
}

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User }