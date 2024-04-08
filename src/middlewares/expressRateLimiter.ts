import rateLimit from "express-rate-limit";
var MongoStore = require("rate-limit-mongo");

export const limiter = rateLimit({
    store: new MongoStore({
        uri: process.env.MONGO_URI,
        // should match windowMs
        expireTimeMs: 15 * 60 * 1000,
        errorHandler: console.error.bind(null, "rate-limit-mongo"),
        // see Configuration section for more options and details
    }),
    windowMs: 60 * 1000, // 1 minute window
    max: 20, // Allow 100 requests per window
});
