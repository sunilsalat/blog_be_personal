require("express-async-errors");
require("dotenv").config();
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import cors from 'cors'
import {
    ErrorHandlerMiddleware,
    NotFoundHandler,
    hlm,
    limiter,
} from "./middlewares";
import { loadRoutes } from "./routes/loadRoutes";

const app = express();
app.use(cookieParser(process.env.JWT_SECRET))
var whitelist = [
    'http://localhost:3000',
   
]

var corsOptions = {
    origin: function (origin: any, callback: any) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));
// app.use(limiter);
// app.use(hlm);
// app.use(mongoSanitize());

loadRoutes();

app.use(ErrorHandlerMiddleware);
app.use(NotFoundHandler);

export { app };
