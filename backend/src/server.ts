import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import distanceRoutes from './routes/distance';

import './config/passport';
import travelPlansRoutes from "./routes/travelPlansRoutes";
import travelDestinationsRoutes from "./routes/travelDestinationsRoutes";

const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'secret-secret-secret',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);

// Routes
app.use('/api/travel-plans', travelPlansRoutes);
app.use('/api/travel-destinations', travelDestinationsRoutes);
app.use('/api/routes', distanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
