import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectdb.js'
import passport from 'passport';

const app = express()

const port = process.env.PORT

const corsOptions = {
    // set origin to a specific origin.
    origin: process.env.FRONTEND_HOST,
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions))

app.use(express.json())

app.use(passport.initialize());

app.use(cookieParser())

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
  })