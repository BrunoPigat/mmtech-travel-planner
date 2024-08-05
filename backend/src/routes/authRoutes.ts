import { Router } from 'express';
import passport from 'passport';
import { createUser } from '../models/userModel';
import {User} from "../types";
import {ensureAuthenticated} from "./middlewares";

const router = Router();

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await createUser(username, password);
        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local', (err: Error, user: User, info: any) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info.message });

        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.json({ message: 'Logged in successfully', user });
        });
    })(req, res, next);
});

router.get('/profile', ensureAuthenticated, (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    res.json(req.user);
});

router.post('/signout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Signout successful' });
    });
});

export default router;
