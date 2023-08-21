import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined')
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined')
    }
    
    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.error(error);
    }
    
    app.listen(3030, () => {
        console.log('Authentication Service now listening on port 3030')
    });
}

start();