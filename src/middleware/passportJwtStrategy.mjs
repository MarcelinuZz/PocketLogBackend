import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import db from '../utils/dbConfig.mjs';

export default function passportJwtStrategy() {

    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || "Kj9!pL2#mN5*qR8@zX1^vB4&tY7(uI0PocketLog+dF9[gH2]jK5{lM8}nB1",
        passReqToCallback: true
    }

    passport.use(new JwtStrategy(opts, async function (req, jwt_payload, done) {
        try {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const rawToken = authHeader.split(" ")[1];
                const [blacklist] = await db.query('SELECT id FROM token_blacklist WHERE token_id = ?', [rawToken]);
                if (blacklist.length > 0) {
                    return done(null, false, { message: "Token has been revoked." });
                }
            }

            const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [jwt_payload.sub]);

            if (rows.length > 0) {
                const user = rows[0];
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    }));
}