import mongoose from 'mongoose';
import { DbConnectionString } from '../.secret';

export const init = () => {
    mongoose.connect(DbConnectionString, { useNewUrlParser: true });

    mongoose.Promise = global.Promise;

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
};
