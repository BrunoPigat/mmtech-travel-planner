export interface TravelDestination {
    _id: string;
    index: number;
    title: string;
    distance_to_previous_destination: number;
    travel_plan_id: string;
    travel_time_to_previous_destination: number;
    lat: string;
    lng: string;
}