import api from "./api";

export const getTravelPlan = async (id: string) => {
    return api.get(`/travel-plans/${id}`);
}

export const getTravelPlans = async () => {
    return api.get('/travel-plans');
}

interface CreateTravelPlanParams {
    title: string;
    start_date: string;
    end_date: string;
}

export const createTravelPlan = async ({title, start_date, end_date}: CreateTravelPlanParams) => {
    return api.post('/travel-plans', {title, start_date, end_date});
}

export const deleteTravelPlan = async (id: string) => {
    return api.delete(`/travel-plans/${id}`);
}

export const getTravelPlanDestinations = async (id: string) => {
    return api.get(`/travel-plans/${id}/destinations`);
}


interface CreateTravelPlanDestinationsParams {
    title: string;
    index: number;
    distance_to_previous_destination: number;
    travel_time_to_previous_destination: number;
    travel_plan_id: string;
    lat: string;
    lng: string;
}

export const createTravelPlanDestination = async ({
  title,
  index,
  distance_to_previous_destination,
  travel_time_to_previous_destination,
  travel_plan_id,
  lat,
  lng
}: CreateTravelPlanDestinationsParams) => {
    return api.post(`/travel-destinations`, {
        title,
        index,
        distance_to_previous_destination,
        travel_time_to_previous_destination,
        travel_plan_id,
        lat,
        lng
    });
}

interface UpdateIndexParams {
    id: string;
    isForward: boolean;
}

export const updateDestinationIndex = async ({id, isForward}: UpdateIndexParams) => {
    return api.post(`/travel-destinations/${id}/update-index`, {
        isForward
    }, {timeout: 10000});
};

export const deleteTravelPlanDestination = async (id: string) => {
    return api.delete(`/travel-destinations/${id}`, {timeout: 10000});
}
