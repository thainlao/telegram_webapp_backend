import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './router/authRouter.js';
import userRouter from './router/userRouter.js';
import connectDB from './db.js';
import { startBot } from './bot.js';

dotenv.config();
connectDB();

const app = express();
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/user', userRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    startBot();
});