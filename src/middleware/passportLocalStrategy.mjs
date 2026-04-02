import passport from 'passport';
import LocalStrategy from 'passport-local';
import db from '../utils/dbConfig.mjs';

export default function passportLocalStrategy() {
    passport.use(new LocalStrategy(function verify(username, password, cb) {
        db.query("SELECT * FROM users WHERE name = ?", [username], (err, rows) => {
            if (err) { return cb(err); }
            if (!rows.length) { return cb(null, false, { message: 'Incorrect username.' }); }
            if (rows[0].password != password) { return cb(null, false, { message: 'Incorrect password.' }); }
            return cb(null, rows[0]);
        });
    }))
}
