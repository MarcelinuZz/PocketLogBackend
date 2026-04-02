import passport from 'passport';
import LocalStrategy from 'passport-local';
import db from '../utils/dbConfig.mjs';

export default function passportLocalStrategy() {
    passport.use(new LocalStrategy(async function verify(username, password, cb) {
        const query = `
            SELECT u.*, up.hashed_password 
            FROM users u 
            JOIN user_passwords up ON u.id = up.user_id 
            WHERE u.name = ?
        `;

        try {
            const [rows] = await db.query(query, [username]);

            if (!rows.length) { return cb(null, false, { message: 'Incorrect username.' }); }

            const user = rows[0];

            if (user.hashed_password != password) {
                return cb(null, false, { message: 'Incorrect password.' });
            }

            delete user.hashed_password;

            return cb(null, user);

        } catch (err) {

            return cb(err);
        }
    }))
}
