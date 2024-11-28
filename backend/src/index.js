import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import morgan from "morgan";
import authRouter from './routes/auth.js';
import performerRouter from './routes/performer.js';
import albumsRouter from './routes/albums.js';
import songsRouter from './routes/songs.js';

dotenv.config();

const app = express();
const allowedUrls = ['', 'http://localhost:1234'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedUrls.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('tiny'));

app.use('/auth', authRouter);
app.use('/performer', performerRouter);
app.use('/albums', albumsRouter);
app.use('/songs', songsRouter);

app.listen(process.env.PORT || 7070, () => {
    console.log(`The application is listening on port ${process.env.PORT || 7070}!`);
})