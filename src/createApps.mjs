import express from 'express';
import passport from 'passport';
import passportLocalStrategy from './middleware/passportLocalStrategy.mjs';
import passportJwtStrategy from './middleware/passportJwtStrategy.mjs';
import passportGoogleStrategy from './middleware/passportGoogleStrategy.mjs';


export default function CreateApps() {
    const app = express();
    app.use(express.json());

    passportLocalStrategy();
    passportJwtStrategy();
    passportGoogleStrategy();

    app.use(passport.initialize());

    return app;
}