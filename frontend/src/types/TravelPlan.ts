import {TravelDestination} from "./TravelDestination";

export interface TravelPlan {
    _id: string;
    title: string;
    start_date: string;
    end_date: string;
    user_id: string;
    total_distance: number;
    total_travel_time: number;
    destinations: TravelDestination[];
}
