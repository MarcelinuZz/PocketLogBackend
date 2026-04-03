import express from 'express';
import passport from 'passport';
import passportLocalStrategy from './middleware/passportLocalStrategy.mjs';
import passportJwtStrategy from './middleware/passportJwtStrategy.mjs';


export default function CreateApps() {
    const app = express();
    app.use(express.json());

    passportLocalStrategy();
    passportJwtStrategy();

    app.use(passport.initialize());

    return app;
}