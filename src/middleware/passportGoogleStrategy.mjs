import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import db from "../utils/dbConfig.mjs";
import { query } from "express-validator";
import randomizedIds from "../utils/randomizedIds.mjs";

export default function passportGoogleStrategy() {
    passport.use(new GoogleStrategy({
        // ubah dengan data client id dan client secret anda
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const Querys = `SELECT u.* FROM users u JOIN user_identities ui 
            ON u.id = ui.user_id 
            WHERE ui.provider = 'google' AND ui.provider_id = ?`

            const [rows] = await db.query(Querys, [profile.id])

            if (rows.length > 0) {
                return done(null, rows[0]);
            }

            const birthday = profile._json.birthdays
                ? profile._json.birthdays[0].date
                : null;

            let dobString = null;

            if (birthday) {
                dobString = `${birthday.year}-${birthday.month}-${birthday.day}`;
            }

            const id = await randomizedIds();
            const identityId = await randomizedIds();

            const insertQuery = `INSERT INTO users (id, name, gender, DOB, email, avatar_url) VALUES (?, ?, ?, ?, ?, ?)`
            const insertIdentityQuery = `INSERT INTO user_identities (id, user_id, provider, provider_id) VALUES (?, ?, ?, ?)`

            const userGender = profile.gender || (profile._json && profile._json.gender) || null;
            const avatarUrl = profile.photos?.[0]?.value || null;

            const connection = await db.getConnection();
            try {
                await connection.beginTransaction();

                await connection.query(insertQuery, [id, profile.displayName, userGender, dobString, profile.emails[0].value, avatarUrl]);
                await connection.query(insertIdentityQuery, [identityId, id, "google", profile.id]);

                await connection.commit();
                connection.release();
            } catch (transactionErr) {
                await connection.rollback();
                connection.release();
                throw transactionErr;
            }

            const [newUser] = await db.query(Querys, [profile.id]);
            return done(null, newUser[0]);

        } catch (err) {
            return done(err, null);
        }
    }));
}