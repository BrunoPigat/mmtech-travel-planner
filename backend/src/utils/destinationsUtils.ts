import {TravelDestination, TravelDestinations} from "../models/travelDestinations";
import {calculateDistance} from "./distanceCalculator";

export const updateDistanceAndDuration = async (newIndex: number, endIndex: number, destinations: TravelDestination[]) => {
    try {
        const startDestination = destinations[newIndex];
        const start = {
            lat: parseFloat(startDestination.lat),
            lng: parseFloat(startDestination.lng)
        }

        const endDestination = destinations[endIndex];
        const end = {
            lat: parseFloat(endDestination.lat),
            lng: parseFloat(endDestination.lng)
        }

        const {distance, duration} = await calculateDistance(start, end);

        await Promise.all([
            TravelDestinations.updateDistance(endDestination._id as string, distance),
            TravelDestinations.updateDuration(endDestination._id as string, duration),
        ]);
    } catch (e){
        console.error(e);
    }
}
