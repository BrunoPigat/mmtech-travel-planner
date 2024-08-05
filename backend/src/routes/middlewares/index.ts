import { Request, Response, NextFunction } from 'express';
import {TravelDestinations} from "../../models/travelDestinations";
import {TravelPlans} from "../../models/travelPlans";

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

export const checkTravelDestinationUserOwnership = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.user){
            return res.status(401).json({ error: 'No user authenticated' });
        }

        const destination = await TravelDestinations.getById(req.params.id);
        if (!destination) {
            return res.status(404).json({ error: 'Destination not found' });
        }

        const travelPlanId = destination.travel_plan_id;
        const travelPlan = await TravelPlans.getById(travelPlanId);

        // @ts-ignore
        if (!travelPlan || travelPlan.user_id !== req.user._id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        next();
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const checkTravelPlanUserOwnership = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.user){
            return res.status(401).json({ error: 'No user authenticated' });
        }

        const travelPlan = await TravelPlans.getById(req.params.id);
        if (!travelPlan) {
            return res.status(404).json({ error: 'Travel Plan not found' });
        }

        // @ts-ignore
        if (!travelPlan || travelPlan.user_id !== req.user._id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        next();
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
