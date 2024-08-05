import express from 'express';
import { TravelDestinations } from '../models/travelDestinations';
import {TravelPlansDestinations, TravelPlansDestinationsModel} from "../models/travelPlansDestinations";
import {calculateDistance} from "../utils/distanceCalculator";
import {checkTravelDestinationUserOwnership, ensureAuthenticated} from "./middlewares";
import {updateDistanceAndDuration} from "../utils/destinationsUtils";

const router = express.Router();

router.post('/', ensureAuthenticated, async (req, res) => {
    try {
        const destination = await TravelDestinations.create(req.body);
        res.status(201).json(destination);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:id/update-index', ensureAuthenticated, checkTravelDestinationUserOwnership, async (req, res) => {
    const { id } = req.params;
    const { isForward } = req.body;

    try {
        const destination = await TravelDestinations.getById(id);
        if (!destination) {
            return res.status(404).json({ error: 'Destination not found' });
        }

        const travelPlanId = destination.travel_plan_id;
        let destinations = await TravelDestinations.getByTravelPlanId(travelPlanId);

        const currentIndex = destination.index;
        const newIndex = isForward ? currentIndex + 1 : currentIndex - 1;

        if (newIndex < 0 || newIndex >= destinations.length) {
            return res.status(400).json({ error: 'Invalid index' });
        }

        await TravelDestinations.updateIndex(id, newIndex);

        for (const dest of destinations){
            if(!dest || !dest._id){
                return res.status(404).json({ error: 'Destination not found' });
            }

            if(dest.index === newIndex){
                const destNewIndex = isForward ? dest.index - 1 : dest.index + 1;
                await TravelDestinations.updateIndex(dest._id, destNewIndex);
            }
        }

        destinations = await TravelDestinations.getByTravelPlanId(travelPlanId);
        destinations = destinations.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

        for (let i = 0; i < destinations.length - 1; i++) {
            const startDestination = destinations[i];
            const endDestination = destinations[i + 1];

            const start = { lat: parseFloat(startDestination.lat), lng: parseFloat(startDestination.lng) };
            const end = { lat: parseFloat(endDestination.lat), lng: parseFloat(endDestination.lng) };

            const { distance, duration } = await calculateDistance(start, end);

            await Promise.all([
                TravelDestinations.updateDistance(endDestination._id as string, distance),
                TravelDestinations.updateDuration(endDestination._id as string, duration)
            ]);
        }

        await TravelDestinations.updateTravelPlanTotals(travelPlanId);

        res.status(200).json({ message: 'Index updated successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const destinations = await TravelDestinations.getAll();
        res.json(destinations);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', ensureAuthenticated, checkTravelDestinationUserOwnership, async (req, res) => {
    try {
        const destination = await TravelDestinations.getById(req.params.id);
        res.json(destination);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', ensureAuthenticated, checkTravelDestinationUserOwnership, async (req, res) => {
    try {
        const numReplaced = await TravelDestinations.update(req.params.id, req.body);
        res.json({ numReplaced });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', ensureAuthenticated, checkTravelDestinationUserOwnership, async (req, res) => {
    const destinationId = req.params.id;

    try {
        const numRemoved = await TravelDestinations.delete(destinationId);

        if (numRemoved > 0) {
            await TravelPlansDestinationsModel.deleteByDestinationId(destinationId);
        }

        res.json({ numRemoved });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
