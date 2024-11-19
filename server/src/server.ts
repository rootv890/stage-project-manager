import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import bodyParser from 'body-parser';
import {supabase} from "./supabase";

// CONFIGS
const configs = {
    PORT: process.env.PORT || 5051
};

const app = express();

// Middlewares (Cors, Helmet, BodyParser)
app.use(cors({
    origin: '*' // TODO Change this to the frontend URL
}));

// Supabase Auth Middleware
supabase.auth.onAuthStateChange((event, session) => {
    setTimeout(() => {
        console.log("Supabase Auth Event: ", event);
        console.log("Supabase Auth Session: ", session);

        if (event === 'SIGNED_IN') {
            console.log("User signed in", session);
        } else if (event === 'SIGNED_OUT') {
            console.log("User signed out")
        }
    }, 0)

})

// data.subscription.unsubscribe()

// Userinfo
app.get("/userinfo", async (req, res) => {

})

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true})); // Body parser

// Routes


// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Next Error: ", err);

    res.status(500).json({
        status: false,
        message: err.message || 'Internal Server Error'
    });
});

// Start server
app.listen(configs.PORT, () => {
    console.log(`Server is running on port http://localhost:${configs.PORT}`);
});