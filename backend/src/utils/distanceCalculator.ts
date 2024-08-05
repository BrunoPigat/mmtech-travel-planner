import axios from 'axios';

const API_KEY = '5b3ce3597851110001cf6248de3266a7d1714fb2a504a2791f662426';

export const calculateDistance = async (start: { lat: number; lng: number }, end: { lat: number; lng: number }) => {
    try {
        const { data: {features} } = await axios.get('https://api.openrouteservice.org/v2/directions/driving-car', {
            params: {
                start: `${start.lng},${start.lat}`,
                end: `${end.lng},${end.lat}`,
                api_key: API_KEY
            },
            timeout: 10000
        });

        const { distance, duration } = features[0].properties.summary;

        return { distance: distance / 1000, duration: duration / 60 };
    } catch (error) {
        console.error('Error fetching data from OpenRouteService:', error);
        throw new Error('Failed to calculate distance and time');
    }
};
