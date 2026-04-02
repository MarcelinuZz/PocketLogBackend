import express from 'express';
import passport from 'passport';
import passportLocalStrategy from './middleware/passportLocalStrategy.mjs';


export default function CreateApps() {
    const app = express();
    app.use(express.json());

    passportLocalStrategy();

    app.use(passport.initialize());

    return app;
}