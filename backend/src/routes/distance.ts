import express, {Request, Response} from 'express';
import {calculateDistance} from "../utils/distanceCalculator";
import {ensureAuthenticated} from "./middlewares";

const router = express.Router();

interface Coordinates {
    lat: number;
    lng: number;
}

interface CalculateRequestBody {
    start: Coordinates;
    end: Coordinates;
}

router.post('/calculate', ensureAuthenticated, async (req: Request, res: Response) => {
    const { start, end }: CalculateRequestBody = req.body;

    if (!start || !end || !start.lat || !start.lng || !end.lat || !end.lng) {
        return res.status(400).json({ error: 'Invalid request. Please provide start and end coordinates.' });
    }

    try {
        const { distance, duration } = await calculateDistance(start, end);
        res.json({ distance, duration });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while calculating the distance and time.' });
    }
});

export default router;
