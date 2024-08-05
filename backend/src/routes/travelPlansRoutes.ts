import express from 'express';
import { TravelPlans } from '../models/travelPlans';
import { TravelPlansDestinations, TravelPlansDestinationsModel } from "../models/travelPlansDestinations";
import {TravelDestination, TravelDestinations} from "../models/travelDestinations";
import {checkTravelPlanUserOwnership, ensureAuthenticated} from "./middlewares";

const router = express.Router();

router.post('/', ensureAuthenticated, async (req, res) => {
    const { title, start_date, end_date } = req.body;
    const user = req.user;

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // @ts-ignore
    const userId = user._id
    try {
        const newPlan = {
            title,
            start_date,
            end_date,
            total_distance: 0,
            total_travel_time: 0,
        };

        const createdPlan = await TravelPlans.create(newPlan, userId.toString());
        res.status(201).json(createdPlan);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const plansWithDestinations = await TravelPlans.getAll(userId);
        res.json(plansWithDestinations);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', ensureAuthenticated, checkTravelPlanUserOwnership, async (req, res) => {
    try {
        const planId = req.params.id;
        const plan = await TravelPlans.getById(planId);

        if (!plan) {
            return res.status(404).json({ error: 'Travel plan not found' });
        }

        const links: TravelPlansDestinations[] = await TravelPlansDestinationsModel.getByPlanId(planId);
        const destinationIds: string[] = links.map(link => link.travel_destination_id);
        const destinations = await Promise.all(destinationIds.map(id => TravelDestinations.getById(id)));

        const sortedDestinations = destinations
            .filter((dest): dest is TravelDestination => dest !== null)
            .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

        res.json({
            ...plan,
            destinations: sortedDestinations
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', ensureAuthenticated, checkTravelPlanUserOwnership, async (req, res) => {
    try {
        const numReplaced = await TravelPlans.update(req.params.id, req.body);
        res.json({ numReplaced });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', ensureAuthenticated, checkTravelPlanUserOwnership, async (req, res) => {
    try {
        const numRemoved = await TravelPlans.delete(req.params.id);
        res.json({ numRemoved });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/destinations', ensureAuthenticated, checkTravelPlanUserOwnership, async (req, res) => {
    try {
        const planId = req.params.id;
        const links = await TravelPlansDestinationsModel.getByPlanId(planId);

        const destinationIds = links.map(link => link.travel_destination_id);
        const destinations = await Promise.all(destinationIds.map(id => TravelDestinations.getById(id)));

        res.json(destinations.filter(dest => dest !== null));
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
