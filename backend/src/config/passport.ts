import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { findUserByUsername, findUserById } from '../models/userModel';
import bcrypt from 'bcryptjs';

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await findUserByUsername(username);
            if (!user) return done(null, false, { message: 'User not found' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) return done(null, user);
            else return done(null, false, { message: 'Incorrect password' });
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await findUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
