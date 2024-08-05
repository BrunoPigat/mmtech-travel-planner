import {Coordinates} from "../types/geo";
import api from "./api";

export const getTravelTime = async (start: Coordinates, end: Coordinates) => {
    try {
        return api.post('/routes/calculate', {
            start: {
                lat: start.lat,
                lng: start.lng
            },
            end: {
                lat: end.lat,
                lng: end.lng
            },
        }, {timeout: 10000});
    } catch (error) {
        console.error('Error fetching travel time:', error);
        throw new Error('Failed to fetch travel time');
    }
};
